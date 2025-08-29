

import React from 'react';

import { BaseHeaderLayout, Layout, ContentLayout } from "@strapi/design-system/Layout";
import { Textarea, Typography, Button } from '@strapi/design-system';

import { LoadingIndicatorPage } from '@strapi/helper-plugin';
import { syncDatabaseRequests } from '../../api/databasesync';

// Convert JSON to CSV
const jsonToCsv = (jsonArray: any[]): string => {
  if (jsonArray.length === 0) {
    return '';
  }

  console.log(jsonArray);

  const excludedKeys = ['id', 'createdAt', 'updatedAt'];
  const headers = jsonArray[0].header
    .map((h: { headername: string; value: any }) => h.headername)
    .filter((key: string) => !excludedKeys.includes(key));

  const formattedHeaders = headers.map((header: string) => header.replace(/_/g, ' '));
  const csvRows = jsonArray.map((row: any) =>
    headers.map((header: string) => {
      const headerObj = row.header.find((h: { headername: string; value: any }) => h.headername === header);
      return headerObj && headerObj.value !== null && headerObj.value !== undefined ? headerObj.value : '';
    }).join(',')
  );

  return [formattedHeaders.join(','), ...csvRows].join('\n');
};

// Convert CSV back to JSON
const csvToJson = (csvString: string): any[] => {
  const [headerLine, ...lines] = csvString.split('\n');
  const headers = headerLine.split(',').map(header => header.replace(/ /g, '_'));

  const regex = /,(?=(?:[^"]|"[^"]*")*$)/;
  return lines.map(line => {
    const values = line.split(regex);
    const result: any = {};

    headers.forEach((header, index) => {
      result[header] = values[index].replace(/^"|"$/g, ''); // remove quotes
    });


    return result;
  });
};

const HomePage = () => {
  const [value, setValue] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [jsonValue, setJsonValue] = React.useState<any[]>([]);

  const handleConvertToJson = async () => {
    const json = csvToJson(value);
    console.log(json);
    setJsonValue(json);
    setLoading(true);
    const res = syncDatabaseRequests.sync(json, process.env.STRAPI_ADMIN_SYNC_SECRET || 'changethis');
    // console.log(await res);
    setLoading(false);
  };

  const fetchData = async () => {
    console.log("useeffect");

    if (!loading) setLoading(true);
    const data = await syncDatabaseRequests.getAllRows();
    // Pass the data array directly to jsonToCsv
    const res = jsonToCsv(data.data);

    console.log(res);
    setValue(res);
    console.log(data.data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);


  if (loading) {
    return <>
    <Typography variant='alpha'>Loading... Please do not turn off, if you have 50k+ rows it is expected to take long</Typography>

    <LoadingIndicatorPage />;
    </>
  }


  return (
    <Layout>
      <BaseHeaderLayout
        title="DaaSBoilerplate Sync"
        description="Sync your database with the latest changes."
        as="h2"
      />

      <ContentLayout>

        <Typography variant='delta'>Your csv data</Typography>

        <Textarea
          placeholder="Copy paste your .csv content here"
          name="content"
          value={value}
          height="400px"
          onChange={(e: any) => {
            setValue(e.target.value)
          
          }}
        />

<Button
          onClick={() => {
            setValue('');


          }}
        >
          Clear textfield
        </Button>

<br></br>
        <Button
        size="l"

          onClick={() => {
            handleConvertToJson();


          }}
        >
          Sync data!
        </Button>


        <Typography variant='omega'>Click here to update your database, the more rows you have the longer it takes to upload</Typography>


      </ContentLayout>

    </Layout>

  );
};

export default HomePage;
