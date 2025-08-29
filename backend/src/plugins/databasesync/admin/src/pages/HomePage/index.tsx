import React, { useState, useEffect, useCallback } from "react";
import {
  BaseHeaderLayout,
  Layout,
  ContentLayout,
  Box,
  Typography,
  Button,
  Select,
  Option,
  Alert,
  Flex,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardSubtitle,
  Grid,
  GridItem,
  TextInput,
  ToggleInput,
  Stack,
  IconButton,
  Divider,
  Status,
  Badge,
  ProgressBar,
  Loader,
} from "@strapi/design-system";
import { Upload, Plus, Trash, Cross } from "@strapi/icons";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";
import { syncDatabaseRequests } from "../../api/databasesync";

interface FieldMapping {
  [key: string]: string | null; // null represents ignored fields
}

const HomePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [csvFields, setCsvFields] = useState<string[]>([]);
  const [dbFields, setDbFields] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [overwriteDatabase, setOverwriteDatabase] = useState(false);
  const [customFieldName, setCustomFieldName] = useState<string>("");
  const [hasHeaderMismatch, setHasHeaderMismatch] = useState(false);
  const [showCustomField, setShowCustomField] = useState(false);
  const [ignoredFields, setIgnoredFields] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    fetchDbFields();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (startTime && isUploading) {
      // Update elapsed time every second
      intervalId = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [startTime, isUploading]);

  const fetchDbFields = async () => {
    try {
      const response = await syncDatabaseRequests.getFields();
      const existingFields = response.fields || [];
      setDbFields(existingFields);

      if (csvFields.length > 0) {
        checkHeaderMismatch(existingFields);
      }
    } catch (err) {
      setError("Failed to fetch database fields");
    }
  };

  const checkHeaderMismatch = useCallback(
    (existingFields: string[]) => {
      // A field is mismatched if:
      // 1. It's not in dbFields AND
      // 2. It's not ignored AND
      // 3. It's not mapped to a valid field
      const mismatch = csvFields.some(
        (field) =>
          !dbFields.includes(field) && // Not in database fields
          !ignoredFields.has(field) && // Not ignored
          (!fieldMapping[field] || fieldMapping[field] === "") // Not mapped
      );

      setHasHeaderMismatch(mismatch);
      if (mismatch && !overwriteDatabase) {
        setError(
          "Warning: Some CSV headers need attention. Please either map them to database fields, ignore them, or enable overwrite mode."
        );
      } else {
        setError(null);
      }
    },
    [csvFields, dbFields, overwriteDatabase, ignoredFields, fieldMapping]
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const headers = text
          .split("\n")[0]
          .split(",")
          .map((h) => h.trim().replace(/^"|"$/g, ""));
        setCsvFields(headers);
        if (dbFields.length > 0) {
          requestAnimationFrame(() => {
            checkHeaderMismatch(dbFields);
          });
        }
      };
      reader.readAsText(file);
    },
    [checkHeaderMismatch, dbFields, overwriteDatabase]
  );

  const handleFieldMapping = (csvField: string, dbField: string | null) => {
    setFieldMapping((prev) => ({
      ...prev,
      [csvField]: dbField,
    }));

    // Update ignored fields
    setIgnoredFields((prev) => {
      const newIgnored = new Set(prev);
      if (dbField === null) {
        newIgnored.add(csvField);
      } else {
        newIgnored.delete(csvField);
      }
      return newIgnored;
    });
  };

  const handleCustomFieldAdd = () => {
    if (customFieldName && !dbFields.includes(customFieldName)) {
      setDbFields([...dbFields, customFieldName]);
      setCustomFieldName("");
      setShowCustomField(false);
    }
  };
  const handleSSEEvents = useCallback(
    (status) => {
      if (status.status === "processing") {
        setUploadProgress(status.progress);
        setProcessedCount(status.processedRows);
        setTotalCount(status.totalRows);
      } else if (status.status === "completed") {
        setSuccess(`Successfully processed ${status.processedRows} rows`);
        setIsUploading(false);
        // Reset file and mapping after successful upload
        setFile(null);
        setFieldMapping({});
        setCsvFields([]);
        fetchDbFields(); // Refresh database fields
        setTimeout(() => {
          window.location.href = `/admin/content-manager/collection-types/api::database.database/`;
        }, 1000);
      } else if (status.status === "failed") {
        setError(`Failed to process file: ${status.error}`);
        setIsUploading(false);
      }
    },
    [
      setUploadProgress,
      setProcessedCount,
      setTotalCount,
      setSuccess,
      setIsUploading,
      setFile,
      setFieldMapping,
      setCsvFields,
      fetchDbFields,
    ]
  );

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    // If not overwriting, check field mapping
    if (!overwriteDatabase) {
      const mappedFields = Object.entries(fieldMapping).filter(([_, value]) => value !== null);
      if (mappedFields.length === 0) {
        setError("Please map at least one field or enable overwrite mode");
        return;
      }

      if (hasHeaderMismatch) {
        setError("Please map all fields or enable overwrite mode");
        return;
      }
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);
    setProcessedCount(0);
    setTotalCount(0);

    try {
      const formData = new FormData();
      formData.append("files", file);

      const data = {
        fieldMapping: overwriteDatabase
          ? {}
          : Object.fromEntries(Object.entries(fieldMapping).filter(([_, v]) => v !== null)),
        overwrite: overwriteDatabase,
      };

      formData.append("data", JSON.stringify(data));

      setStartTime(Date.now());
      await syncDatabaseRequests.upload(formData, handleSSEEvents);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload and process file");
    }
  };

  useEffect(() => {
    const fetchActiveJobs = async () => {
      const activeJobs = await syncDatabaseRequests.getActiveJobs();
      console.log("Active jobs:", activeJobs);
      if (activeJobs?.length > 0) {
        setIsUploading(true);
        setStartTime(Number(activeJobs[0].id));
        if (activeJobs[0].progress < 100) {
          await syncDatabaseRequests.subscribeToJob(activeJobs[0].id, handleSSEEvents);
        } else {
          setIsUploading(false);
        }
      }
    };
    fetchActiveJobs();
  }, []);
  if (loading && !isUploading) {
    return <LoadingIndicatorPage />;
  }

  return (
    <Layout>
      <BaseHeaderLayout title="Database Sync" subtitle="Import your Database data from a CSV file" as="h2" />

      <ContentLayout>
        <Stack spacing={4}>
          {error && (
            <Alert closeLabel="Close alert" title="Error" variant="danger" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert closeLabel="Close alert" title="Success" variant="success" onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}

          {isUploading && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <Typography variant="beta" textAlign="center">
                    Processing File
                  </Typography>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  <Box>
                    <style>
                      {`
                      .progress-bar {
                        width: 100%;
                        height: 20px;
                        border-radius: 10px;
                      }
                      .progress-bar::before {
                        border-radius: 10px;
                        background-color: lightblue !important;
                      }
                      `}
                    </style>
                    <ProgressBar value={uploadProgress} size="M" className="progress-bar" description="Processing..." />
                    <Typography variant="pi" fontWeight="bold">
                      Progress: {uploadProgress}%
                    </Typography>
                  </Box>
                  <Flex alignItems="start" direction="column">
                    <Typography variant="pi" style={{ fontVariantNumeric: "tabular-nums" }}>
                      Processed: {processedCount} rows
                    </Typography>
                    {totalCount > 0 && (
                      <Typography variant="pi" style={{ fontVariantNumeric: "tabular-nums" }}>
                        Total: {totalCount} rows
                      </Typography>
                    )}
                    {startTime && (
                      <Typography variant="pi" style={{ fontVariantNumeric: "tabular-nums" }}>
                        Elapsed Time {elapsedTime.toFixed(0)} seconds, rate {(processedCount / elapsedTime).toFixed(0)}{" "}
                        rows/s
                      </Typography>
                    )}
                  </Flex>
                  {/* <Typography style={{ fontWeight: "bold", color: "red", fontSize: "16px" }}>
                  Don't close the page or refresh it
                </Typography> */}
                </Stack>
              </CardBody>
            </Card>
          )}

          <Card style={{ opacity: isUploading ? 0.5 : 1, cursor: isUploading ? "not-allowed" : "auto" }}>
            <CardHeader justifyContent="start" alignItems="center" padding={4}>
              <Stack spacing={2}>
                <CardTitle>
                  <Typography variant="beta" textAlign="center" mr="auto">
                    CSV File Upload
                  </Typography>
                </CardTitle>
                <CardSubtitle>Select a CSV file and configure import settings</CardSubtitle>
              </Stack>
            </CardHeader>
            <CardBody>
              <Stack spacing={4} padding={4} width="100%">
                <Box>
                  <Stack spacing={2}>
                    <Typography variant="delta">File Selection</Typography>
                    <Flex gap={2}>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        id="csv-upload"
                      />
                      <Button
                        variant="secondary"
                        startIcon={<Upload />}
                        onClick={() => document.getElementById("csv-upload")?.click()}
                        disabled={isUploading}
                      >
                        Select CSV File
                      </Button>
                      {file && (
                        <Status variant="warning" showBullet size="S">
                          {file.name}
                        </Status>
                      )}
                    </Flex>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Stack spacing={2}>
                    <Typography variant="delta">Import Settings</Typography>
                    <ToggleInput
                      onLabel="Add new fields"
                      offLabel="Overwrite database"
                      hint="Will clear existing data and use CSV headers as new field names"
                      checked={!overwriteDatabase}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setOverwriteDatabase(!e.target.checked);
                        if (e.target.checked) {
                          // Clear any errors since we're overwriting
                          setError(null);
                          setHasHeaderMismatch(false);
                        } else if (hasHeaderMismatch) {
                          setError("Warning: Some CSV headers don't match existing database fields");
                        }
                      }}
                    />
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Stack spacing={2}>
                    <Typography variant="delta">Custom Field</Typography>
                    {showCustomField ? (
                      <Flex gap={2}>
                        <TextInput
                          placeholder="Enter custom field name"
                          value={customFieldName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomFieldName(e.target.value)}
                          aria-label="Custom field name"
                          error={
                            customFieldName && dbFields.includes(customFieldName)
                              ? "Field name already exists"
                              : undefined
                          }
                        />
                        <Button
                          onClick={handleCustomFieldAdd}
                          disabled={!customFieldName || dbFields.includes(customFieldName) || isUploading}
                          startIcon={<Plus />}
                        >
                          Add Field
                        </Button>
                        <IconButton
                          onClick={() => {
                            setShowCustomField(false);
                            setCustomFieldName("");
                          }}
                          disabled={isUploading}
                          label="Cancel"
                          icon={<Trash />}
                        />
                      </Flex>
                    ) : (
                      <Button
                        variant="tertiary"
                        startIcon={<Plus />}
                        onClick={() => setShowCustomField(true)}
                        disabled={isUploading}
                      >
                        Add Custom Field
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </CardBody>
          </Card>

          {csvFields.length > 0 && !overwriteDatabase && (
            <Card style={{ opacity: isUploading ? 0.5 : 1, cursor: isUploading ? "not-allowed" : "auto" }}>
              <CardHeader justifyContent="start" alignItems="center" padding={4}>
                <Stack spacing={2}>
                  <CardTitle>
                    <Typography variant="beta" textAlign="center">
                      Field Mapping
                    </Typography>
                  </CardTitle>
                  <CardSubtitle>Map CSV columns to database fields or ignore them</CardSubtitle>
                </Stack>
              </CardHeader>
              <CardBody width="100%">
                <Stack spacing={4} width="100%" padding={4}>
                  <Grid gap={4} columns={12}>
                    {csvFields.map((csvField) => (
                      <GridItem key={csvField} col={6}>
                        <Stack spacing={1}>
                          <Flex gap={2} alignItems="center">
                            <Typography variant="pi" fontWeight="bold">
                              {csvField}
                            </Typography>
                            {ignoredFields.has(csvField) && <Badge size="S">Ignored</Badge>}
                          </Flex>
                          <Flex gap={2}>
                            <Box grow={1}>
                              <Select
                                placeholder="Select database field"
                                onChange={(value: string) => handleFieldMapping(csvField, value)}
                                value={fieldMapping[csvField] || ""}
                                disabled={ignoredFields.has(csvField)}
                                error={
                                  hasHeaderMismatch && !fieldMapping[csvField] && !ignoredFields.has(csvField)
                                    ? "Field mapping required"
                                    : undefined
                                }
                              >
                                {dbFields.map((field) => (
                                  <Option key={field} value={field}>
                                    {field}
                                  </Option>
                                ))}
                              </Select>
                            </Box>
                            <IconButton
                              onClick={() => {
                                if (ignoredFields.has(csvField)) {
                                  handleFieldMapping(csvField, "");
                                } else {
                                  handleFieldMapping(csvField, null);
                                }
                              }}
                              label={ignoredFields.has(csvField) ? "Include field" : "Ignore field"}
                              icon={ignoredFields.has(csvField) ? <Plus /> : <Cross />}
                            />
                          </Flex>
                        </Stack>
                      </GridItem>
                    ))}
                  </Grid>

                  <Box>
                    <Button
                      fullWidth
                      size="L"
                      disabled={Object.entries(fieldMapping).filter(([_, v]) => v !== null).length === 0 || isUploading}
                      onClick={() => {
                        if (!isUploading) {
                          handleUpload();
                        }
                      }}
                    >
                      Upload and Process Data
                    </Button>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          )}

          {csvFields.length > 0 && overwriteDatabase && (
            <Card style={{ opacity: isUploading ? 0.5 : 1, cursor: isUploading ? "not-allowed" : "auto" }}>
              <CardHeader justifyContent="start" alignItems="center" padding={4}>
                <Stack spacing={2}>
                  <CardTitle>
                    <Typography variant="beta" textAlign="center" mr="auto">
                      New Database Structure
                    </Typography>
                  </CardTitle>
                  <CardSubtitle>The following fields will be created from your CSV</CardSubtitle>
                </Stack>
              </CardHeader>
              <CardBody width="100%">
                <Stack spacing={4} width="100%" padding={4}>
                  <Grid gap={4} columns={12}>
                    {csvFields.map((field) => (
                      <GridItem key={field} col={6}>
                        <Box padding={4} background="neutral100" hasRadius>
                          <Typography>{field}</Typography>
                        </Box>
                      </GridItem>
                    ))}
                  </Grid>

                  <Box>
                    <Button
                      fullWidth
                      size="L"
                      variant="danger-light"
                      disabled={isUploading}
                      onClick={() => {
                        if (!isUploading) {
                          handleUpload();
                        }
                      }}
                    >
                      Clear Database and Import New Data
                    </Button>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          )}
        </Stack>
      </ContentLayout>
    </Layout>
  );
};

export default HomePage;
