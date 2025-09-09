import React from "react";
import { Box, Heading, Text, VStack, Container, Link } from "@chakra-ui/react";
import Wrapper from "@/components/Wrapper";
import { GetStaticProps } from "next";
import { withCommonStaticProps } from "@/utils/data-service";
import { configType, Product } from "@/types/types";

type TermsOfServiceProps = {
  featuredProduct: Product;
  config: configType;
};

const TermsOfService: React.FC<TermsOfServiceProps> = ({ featuredProduct, config }) => {
  const PROJECTNAME = process.env.NEXT_PUBLIC_PROJECTNAME;
  const PROJECTDOMAINNAME = process.env.NEXT_PUBLIC_PROJECTDOMAINNAME;

  return (
    <Wrapper featuredProduct={featuredProduct} config={config}>
      <Container maxW="container.md" py={10}>
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl">
            License Terms and Conditions
          </Heading>
          <Text>Last Updated: May 16, 2025</Text>

          <Box>
            <Heading as="h2" size="lg">
              1. Acceptance.
            </Heading>
            <br />
            <Text>
              1.1. Scope. These License Terms and Conditions are entered into by and between Customer and AMAttendees.com (“AMAttendees”, “we”, or “us”). The following terms and conditions, together with any other documents expressly incorporated by reference (collectively, the “License Terms”), govern (i) Customer’s access to and use of www.AMAttendees.com and the content and functionality offered on or through www.AMAttendees.com (collectively, the “Website”), and (ii) Customer’s use of AMAttendees’s proprietary, hosted service database product and/or application programming interface offerings (the “Subscription Services”) and the all associated documentation (if any) (the “Documentation” and, together with the Subscription Services, the “Product”). The effective date of these License Terms as to Customer’s use of the Website, Subscription Services, or the Product is the date that you first accept or agree to these License Terms.
              <br />
              <br />
              1.2. Eligibility. THIS WEBSITE, SUBSCRIPTION SERVICES, AND THE PRODUCT ARE OFFERED AND AVAILABLE TO USERS WHO ARE 18 YEARS OF AGE OR OLDER. IF CUSTOMER IS  UNDER AGE 18 CUSTOMER  MUST HAVE CUSTOMER’S PARENT OR LEGAL GUARDIAN’S PERMISSION TO USE THE SUBSCRIPTION SERVICES, AS WELL AS HAVE HIM OR HER READ AND AGREE TO THESE TERMS. BY USING THE WEBSITE, SUBSCRIPTION SERVICES, AND/OR THE PRODUCT, CUSTOMER  REPRESENTS, ACKNOWLEDGES, AND AGREES THAT CUSTOMER IS AT LEAST 18 YEARS OF AGE AND CUSTOMER AGREES TO THESE TERMS OF USE. IF CUSTOMER DOES NOT MEET THESE REQUIREMENTS, CUSTOMER MUST NOT ACCESS OR USE THE WEBSITE, SUBSCRIPTION SERVICES, AND/OR THE PRODUCT. IF CUSTOMER IS ENTERING INTO THESE LICENSE TERMS ON BEHALF OF A COMPANY, BUSINESS, OR OTHER LEGAL ENTITY, CUSTOMER REPRESENTS THAT CUSTOMER HAS THE AUTHORITY TO BIND SUCH ENTITY TO THESE LICENSE TERMS , IN WHICH CASE THE TERM “CUSTOMER” SHALL REFER TO SUCH ENTITY. IF CUSTOMER DOES NOT HAVE SUCH AUTHORITY, OR IF CUSTOMER DOES NOT AGREE WITH THESE TERMS OF USE, CUSTOMER MUST NOT ACCEPT THESE LICENSE TERMS AND MAY NOT USE ANY OF THE SUBSCRIPTION SERVICES, THE PRODUCT, AND/OR THE WEBSITE. AS A COMPANY, BUSINESS, OR OTHER LEGAL ENTITY, CUSTOMER AGREES TO THESE LICENSE TERMS  ON BEHALF OF CUSTOMER’S ENTITY AND ALL AUTHORIZED USERS UNDER CUSTOMER’S ACCOUNT, WHETHER INTERNAL OR EXTERNAL, AND CUSTOMER IS RESPONSIBLE FOR SUCH AUTHORIZED USERS AND THEIR COMPLIANCE WITH THESE LICENSE TERMS. CUSTOMER IS RESPONSIBLE FOR ENSURING THAT ALL OF CUSTOMER’S AUTHORIZED USERS, WHETHER INTERNAL OR EXTERNAL, UNDERSTAND THESE LICENSE TERMS AND AGREE TO ABIDE BY THESE LICENSE TERMS. ANY BREACH OF THESE LICENSE TERMS BY ANY OF CUSTOMER’S AUTHORIZED USERS WILL BE DEEMED A BREACH BY CUSTOMER. IF CUSTOMER IS AN ACCOUNT ADMINISTRATOR FOR A COMPANY, BUSINESS, OR OTHER LEGAL ENTITY, CUSTOMER AGREES THAT CUSTOMER HAVE ALL NECESSARY RIGHTS TO PROVIDE US WITH ANY PERSONAL DATA, IF ANY, OF CUSTOMER’S AUTHORIZED USERS UNDER CUSTOMER’S ACCOUNT.
              <br />
              <br />
              1.3. Binding. READ THESE LICENSE TERMS CAREFULLY BEFORE USING OUR WEBSITE, THE SUBSCRIPTION SERVICES, OR THE PRODUCT. BY USING THE WEBSITE, SUBSCRIPTION SERVICES, OR THE PRODUCT, INDICATING CUSTOMER’S AGREEMENT TO THESE LICENSE TERMS SUCH AS REFERENCED ON AN ORDER FORM, OR CLICKING THE “I AGREE TO THE LICENSE TERMS” CHECKBOX, CUSTOMER ACCEPTS AND AGREES TO BE BOUND AND ABIDE BY THESE LICENSE TERMS AND OUR PRIVACY POLICY AND WHERE APPLICABLE THE STANDARD CONTRACTUAL CLAUSES (“SCC Agreement”), WHICH ARE INCORPORATED HEREIN BY REFERENCE AND AVAILABLE AT HERE for transfers from the United Kingdom, the European Union and Switzerland. IF CUSTOMER DOES NOT AGREE TO THESE LICENSE TERMS OR THE PRIVACY POLICY, DO NOT ACCESS OR USE THE WEBSITE, SUBSCRIPTION SERVICES, OR THE PRODUCT OR ANY INFORMATION CONTAINED THEREON. BY USING THE WEBSITE, SUBSCRIPTION SERVICES, AND/OR PRODUCT OR BY CLICKING THE “I AGREE TO THE LICENSE TERMS” CHECKBOX, CUSTOMER SHALL BE DEEMED TO BE AGREEING TO ABIDE BY EACH OF THE TERMS SET FORTH BELOW. WE MAY MAKE CHANGES TO THE CONTENT AND SUBSCRIPTION SERVICES OFFERED ON THIS WEBSITE AT ANY TIME. WE CAN CHANGE THESE LICENSE TERMS AT ANY TIME BY POSTING UPDATED LICENSE TERMS ON THE WEBSITE AND BY SENDING CUSTOMER AND/OR CUSTOMER’S AUTHORIZED USERS AN EMAIL NOTICE OF THE CHANGES. IF ANY MODIFICATION IS UNACCEPTABLE TO CUSTOMER, CUSTOMER SHALL CEASE USING THE WEBSITE, SUBSCRIPTION SERVICES, AND/OR THE PRODUCT. IF CUSTOMER DOES NOT CEASE USING THE WEBSITE, SUBSCRIPTION SERVICES, AND/OR THE PRODUCT, CUSTOMER WILL BE CONCLUSIVELY DEEMED TO HAVE ACCEPTED THE CHANGE.
              <br />
              <br />
              IMPORTANT: PLEASE REVIEW THE MUTUAL ARBITRATION AGREEMENT SET FORTH BELOW CAREFULLY, AS IT WILL REQUIRE CUSTOMER TO RESOLVE DISPUTES WITH AMATTENDEES ON AN INDIVIDUAL BASIS (WAIVING CUSTOMER’S RIGHT TO A CLASS ACTION) THROUGH FINAL AND BINDING ARBITRATION. BY ENTERING THIS AGREEMENT, CUSTOMER EXPRESSLY ACKNOWLEDGES THAT CUSTOMER HAS READ AND UNDERSTANDS ALL OF THE TERMS OF THIS MUTUAL ARBITRATION AGREEMENT AND HAS TAKEN THE TIME TO CONSIDER THE CONSEQUENCES OF THIS IMPORTANT DECISION.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              2. Website Terms.
            </Heading>
            <br />
            <Text>
              2.1. Ownership. The Website and all of its content, features, and functionality (including, but not limited to, all information, software text, displays, images, video, and audio, and the design and arrangement thereof) are owned by AMAttendees, its licensors, or other providers of such material and are all protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. Except as otherwise required or limited by applicable law, any reproduction, distribution, modification, retransmission, or publication of any copyrighted material is strictly prohibited without the express written consent of the copyright owner. AMAttendees, its logo, and all related names, logos, product and service names, designs, and slogans are trademarks of AMAttendees or its affiliates or licensors. Customers must not use such marks without the prior written permission of the AMAttendees. All other names, logos, product and service names, designs, and slogans on this Website are the trademarks of their respective owners.
              <br />
              <br />
              2.2. Use of Website. These License Terms allow Customer to use the Website for Customer’s personal, non-commercial use only. Customer must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, transmit or otherwise exploit any of the material on our Website; provided that Customer may print or download one copy of such materials for Customer’s own personal, non-commercial use and not for further reproduction, publication, or distribution. Customers must not delete or alter any copyright, trademark, or other proprietary rights notices from copies of materials from the Website. If Customer prints, copies, modifies, downloads, or otherwise uses or provides any other person with access to any part of the Website in breach of the License Terms, Customer’s right to use the Website will stop immediately and Customer must, at our option, return or destroy any copies of the materials Customer has made. No right, title, or interest in or to the Website or any content on the Website is transferred to Customer, and all rights not expressly granted are reserved by AMAttendees. Any use of the Website not expressly permitted by these License Terms is a breach of these License Terms and may violate copyright, trademark, and other laws.
              <br />
              <br />
              2.3. Jurisdiction. AMAttendees is based in Canada. We make no claims that the Subscription Services, Product, or the Website or any of their content is accessible or appropriate outside of Canada. Access to the Website, Product, or the Subscription Services may not be legal by certain persons or in certain countries. If Customer accesses the Website, Product, or the Subscription Services from outside Canada, Customer does so on Customer’s own initiative and is responsible for compliance with local laws.
              <br />
              <br />
              2.4. Changes. We reserve the right to withdraw or amend the Website, these License Terms, the terms and conditions upon which Customer may be able to access the Website, and any services, features, or material we provide on the Website, in our sole discretion and without providing notice to Customer. We will not be liable if, for any reason, all or any part of the Website is unavailable at any time or for any period. From time to time, we may restrict access to some parts of the Website, or the entire Website, to users for any reason at all. AMAttendees may add new services, features, or material for a fee and may add or amend fees for existing services, features, or material, at any time in our sole discretion. If Customer chooses to purchase the additional services, features, functionality, content, or material, Customer agrees to the pricing and payment terms that may be displayed when Customer makes such purchase, as we may update them from time to time.
              <br />
              <br />
              2.5. Access Credentials. Customers may need a username and password to login into the Website and to use certain functions and portions within the Website, including the Product and Subscription Services. Customers must treat such information as confidential, and Customers must not disclose it to any other person or entity. Customer also acknowledges that Customer’s account is personal to Customer and agrees not to provide any other person with access to this Website or portions of it using Customer’s user name, password, or other security information. Customer agrees to notify us immediately of any unauthorized access to or use of Customer’s user name or password or any other breach of security.
              <br />
              <br />
              2.6. Prohibitions. Customers may use the Website only for lawful purposes and in accordance with these License Terms. Customer agrees not to:
              <br />
              <br />
              use the Website, Product, or Subscription Services in any way that violates any applicable federal, provincial, local, or international law or regulation;
              use the Website, Product, or Subscription Services to transmit, or procure the sending of, any advertising or promotional material, including any “junk mail”, “chain letter”, “spam”, or any other similar solicitation;
              use the Website, Product, or Subscription Services to engage in any other conduct that restricts or inhibits anyone’s use or enjoyment of the Website, Product, or Subscription Services, or which, as determined by us in our sole discretion, may harm AMAttendees or users of the Website, Product, or Subscription Services or expose them to liability;
              use the Website, Product, or Subscription Services in any manner that could disable, overburden, damage, or impair the Website or interfere with any other party’s use of the Website, Product, or Subscription Services, including their ability to engage in real time activities through the Website, Product, or Subscription Services;
              use any robot, spider, or other automatic device, process, or means to access the Website, Product, or Subscription Services for any purpose, including monitoring or copying any of the material on the Website;
              use any manual process to monitor or copy any of the material on the Website, Product, or Subscription Services or for any other unauthorized purpose without our prior written consent;
              use any device, software, or routine that interferes with the proper working of the Website, Product, or Subscription Services;
              introduce any viruses, Trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful;
              attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Website, the server on which the Website is stored, or any server, computer, or database connected to the Website;
              ◦ contains any material that is deceptive, misleading, defamatory, obscene, indecent, abusive, offensive, harassing, violent, hateful, inflammatory, or otherwise objectionable;
              ◦ promotes sexually explicit or pornographic material, violence, or discrimination based on race, sex, religion, nationality, disability, sexual orientation, or age;
              ◦ infringes any patent, trademark, trade secret, copyright, or other intellectual property or other rights of any other person;
              ◦ violates the legal rights (including the rights of publicity and privacy) of others or contain any material that could give rise to any civil or criminal liability under applicable laws or regulations or that otherwise may be in conflict with these License Terms and our Privacy Policy;
              ◦ promotes any illegal activity, or advocate, promote, or assist any unlawful act;
              ◦ causes annoyance, inconvenience, or needless anxiety or be likely to upset, embarrass, alarm, or annoy any other person; or
              ◦ impersonates any person, or misrepresent Customer’s identity or affiliation with any person or organization.
              2.7. Third Party Materials. Information and other content provided by third party licensors and suppliers to AMAttendees (“Third Party Content”) is, in each case, the copyrighted and/or trademarked work of the owner of such Third Party Content. Customer acknowledges and agrees that Customer has no right to download, cache, reproduce, modify, display, edit, alter or enhance any of the Third Party Content in any manner unless Customer has permission from the owner of the Third Party Content. The Website contains links to other sites and resources provided by third parties and such links are provided for Customer’s convenience only. We have no control over the contents of those websites or resources, and accept no responsibility for them or for any loss or damage that may arise from Customer’s use of them. If Customer decides to access any of the third party websites linked to the Website, Customer do so entirely at Customer’s own risk and subject to the terms and conditions of use for such websites.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              3. The Subscription Services, Product, and Data.
            </Heading>
            <br />
            <Text>
              3.1. License. All rights, title and interest in and to the Product and any improved, updated, modified or additional parts thereof, shall at all times remain the property of AMAttendees or its licensors. Nothing herein shall give or be deemed to give Customer any right, title or interest in or to the same except as expressly provided in this Agreement. AMAttendees reserves all rights not expressly granted herein. Subject to and conditioned on Customers and Customer’s Authorized Users’ compliance with the terms and conditions of these License Terms, We hereby grant Customer a non-exclusive, non-transferable license during the applicable Subscription Term (as defined below) (i) to access and use the Product, (ii) to use all associated Documentation in connection with such authorized use of the Subscription Services, and (iii) to make one copy of the Documentation solely for archival and backup purposes; in each case, solely for use by Customer and/or Customer’s Authorized Users in accordance with the terms and conditions herein. Such use is limited to Customer’s internal business use by the number of Authorized Users and solely for the number of credits purchased. Except as expressly stated on an Order Form, each credit is equal to one individual person as a company lead and if a company’s information changes, it will be considered an additional credit.  Except as expressly stated on an Order Form, if credits are not used within a Subscription Term (whether the Initial Subscription Term or a Renewal Subscription Term, credits will not roll over for use in the subsequent Renewal Subscription Term; credits are use it or lose it).  The total number of Authorized Users will not exceed the number provided under the Service Plan (as defined below) purchased, except as expressly agreed to in writing by the parties and subject to any appropriate adjustment of the Fees payable hereunder. For purposes of these License Terms, “Authorized Users” means Customer’s employees, consultants, contractors, and agents (a) who are authorized by Customer to access and use the Product under the rights granted to Customer pursuant to these License Terms; and (b) for whom access to the Product has been purchased.
              <br />
              <br />
              3.2. Subscription Term; Renewal. A list of the service plans and pricing schedules (“Subscription Plan(s)”) that AMAttendees offers is available at https://amattendees.com/#pricing. The initial term of each Subscription Plan shall be for such period that is listed in the purchase confirmation, receipt, agreed upon order form (“Order Form”), and/or the invoice Customer receives from Us (the “Initial Subscription Term”). Customer’s Subscription Plan will automatically renew at the end of the Initial Subscription Term for successive terms equal in duration to the Initial Subscription Term (each a “Renewal Subscription Term”, and, together with the Initial Subscription Term, the “Subscription Term”) unless Customer cancels Customer’s Subscription Plan at least sixty (60) days in advance of the renewal date.
              <br />
              <br />
              3.3. Restrictions. Except as expressly permitted in these License Terms, Customer shall not, and shall not permit any third party to: (i) copy, reverse engineer, reverse assemble, or otherwise attempt to discover the source code of all or any portion of the Product; (ii) reproduce, modify, translate or create derivative works of all or any portion of the Product; (iii) assist any third party to gain access, license, sublicense, resell distribute, assign, transfer or use the Product; (iv) remove or destroy any proprietary notices contained on or in the Product or any copies thereof; or (v) publish or disclose the results of any benchmarking of the Product, or use such results for Customer’s own competing services development activities, without the prior written permission of AMAttendees.
              <br />
              <br />
              3.4. Fees. All of our Subscription Plans are billed in advance on a monthly or annual basis. Customer agrees to pay all fees, charges, and taxes to be paid by Customer in connection with Customers purchased Subscription Plan for the duration of the Subscription Term (the “Fees” or “Subscription Services Fees”). All payments of Subscription Services Fees made are non-refundable and non-transferable. We reserve the right to change our pricing terms at any time. If we do so, we will let Customers know by posting the new pricing terms on the Website or through other communications. We also reserve the right to change other terms of our Subscription Plans at any time, including changing the features that can be accessed through a particular Subscription Plan. To purchase a Subscription Plan, Customer must provide us with current, complete, accurate and authorized credit card or other approved payment method information. Customers agree to promptly notify us of any changes to the provided payment method while Customer’s subscription remains in effect. We subscribe to our payment processors’ account update service. This means that even if Customer’s credit card expires or changes numbers, depending on the terms of Customer’s credit card agreement with Customer’s credit card provider, our payment processors may receive updated card information and will be able to charge Customer’s credit card using the updated information. Customer authorize us to automatically charge the provided payment method for the selected Subscription Plan. We will charge Customer for the Initial Subscription Term at the time of purchase or shortly after purchase. We will charge Customer for renewals of Customer’s Subscription Plan on a recurring basis, at the beginning of each Renewal Subscription Term, until such time that Customer cancels pursuant to Section 3.2. Customer understands that failure to pay any Fees or other charges may result in the suspension or cancellation of Customer’s Subscription Plan. Fees are non-refundable.
              <br />
              <br />
              3.5. Upgrades/Downgrades. Should Customer downgrade Customer’s Subscription Plan, the new Fees for such downgraded Subscription Plan will take effect at the beginning of the following Renewal Subscription Term and no pro-rated refund of any prepaid Fees will be issued to Customer. Should Customer upgrade Customer’s Subscription Plan, the new Fees for such upgraded Subscription Plan will take immediate effect and Customer will be charged in full for the upgraded Subscription Plan.
              <br />
              <br />
              3.6. Data Provisions. Except as expressly permitted in these License Terms, Customer shall not, and shall not permit any third party to: (i) print, download, export, or make copies of Data (as defined below) that is made available to Customer through the Subscription Services; or (ii) use the Product, Subscription Services, or Data, in whole or in part, to advertise, sell, or exchange any products or services related to illegal or illicit activities, including, without limitation, payday loan services, sex products or services, drug products or services, pornographic materials, weapons, or involving credit repair services. The Data is seeded to detect any unauthorized use or duplication thereof, and Customer agrees not to remove any seeds from the Data. For purposes of these License Terms, “Data”  means the information or other data made available by AMAttendees to Customer through the Subscription Services, including, without limitation, the personal information and/or records of individuals and their company affiliation that are contained on AMAttendees’s database and made available to Customer through the Subscription Services. To the extent that Customer’s use of the Subscription Services or Products requires us to enter into one or more of the SCC Agreements with Customer, such as without limitation when you access or download or print one copy of the materials provided by AMAttendees as permitted hereunder from within a jurisdiction that is not considered adequate as per the General Data Protection Regulation (“GDPR”) or the UK General Data Protection Regulation (“UK GDPR”) or equivalent data protection laws in the United Kingdom, Customer agree to be, and are hereby, bound by the applicable SCC Agreements available for Customer’s review here for transfers from the United Kingdom, the European Union and Switzerland and to implement and maintain appropriate technical and organizational measures as set forth in the GDPR or UK GDPR, as applicable.
              <br />
              <br />
              3.7. Suspension of Service. We may, directly or indirectly, suspend, terminate, or otherwise deny Customer’s or any Authorized User’s access to or use of all or any part of the Subscription Services or the Product, without incurring any resulting obligation or liability, if: (a) We receive a judicial or other governmental demand or order, subpoena, or law enforcement request that expressly or by reasonable implication requires us to do so; or (b) We believe, in our good faith discretion, that: (i) Customer or any Authorized User has failed to comply with any term of these License Terms, or accessed or used the Subscription Services or the Product beyond the scope of the rights granted or for a purpose not authorized under these License Terms or in any manner that does not comply with any instruction or requirement set forth in the Documentation; (ii) Customer or any Authorized User is, has been, or is likely to be involved in any fraudulent, misleading, or unlawful activities; or (iii) these License Terms expire or are terminated. This Section is not intended to limit any of our other rights or remedies, whether at law, in equity, or under these License Terms.
              <br />
              <br />
              3.8. Feedback. Customer agrees to make reasonable efforts to provide AMAttendees with oral feedback and/or written feedback related to Customer’s use of the Product, including, but not limited to, a report of any errors which Customer discovers in the Subscription Services or related Documentation. Such reports, and any other materials, information, ideas, concepts, feedback and know-how provided by Customer to AMAttendees concerning the Product and any information reported automatically through the Product to AMAttendees (“Feedback”) will be the property of AMAttendees. Customer agrees to assign, and hereby assign, all right, title and interest worldwide in the Feedback, and the related intellectual property rights, to AMAttendees and agrees to assist AMAttendees, at AMAttendees’s expense, in perfecting and enforcing such rights.
              <br />
              <br />
              3.9. License to Branding Elements. Customer hereby grants to AMAttendees a non-exclusive, royalty-free, irrevocable, and worldwide license to use Customer’s trademarks, service marks, trade dress, trade names, brand names, logos, corporate names, domain names, and other branding elements on or in connection with AMAttendees’s promotional, advertising, and marketing materials in all formats and media, including, without limitation, on lists of AMAttendees’s current or former customers and on advertisements for AMAttendees and/or the Product, Subscription Services, and/or the Website.We collect and store user data, including name, email, and payment information, as necessary to provide
              our services. For details on how we handle your data, please refer to our{" "}

            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              4. Term and Termination.
            </Heading>
            <br />
            <Text>
              4.1. Term. Subject to earlier termination as provided below or otherwise in these License Terms, the term of these License Terms will commence on Customer’s acceptance of these License Terms and will continue for as long as the Product is being provided to Customer under these License Terms and/or under a separate Order Form.
              <br />
              <br />
              4.2. Termination. Subject to the following, Customer has the right to terminate Customer’s account at any time by contacting us to make a cancellation request. Customer may cancel Customer’s Subscription Plan through Customer’s account at any time and for any reason with termination effective at the end of such Subscription Term. However, all Fees paid by Customer hereunder are non-refundable. If Customer cancels Customer’s Subscription Plan prior to the end of the applicable Subscription Term, Customer will no longer be able to continue accessing or using the Service and/or the Product at the end of such Subscription Term and such termination will only be effective at the start of the next billing or Renewal Subscription Term. AMAttendees may terminate Customer’s account and these License Terms at any time by providing sixty (60) days prior notice to the administrative email address associated with Customer’s account. In addition to any other remedies AMAttendees may have, AMAttendees may also terminate these License Terms upon ten (10) days’ notice (or two (2) days in the case of nonpayment), if Customer breaches any of the terms or conditions of these License Terms. Customer acknowledges that AMAttendees reserves the right to terminate accounts that are inactive for an extended period of time and the right to modify or discontinue, temporarily or permanently, the Subscription Services or the Product. Upon the expiration or earlier termination of these License Terms, Customer’s rights to use the Product and the Data shall terminate, Customer shall cease use of the Product and the Data, and Customer shall, within seven (7) days of the date of expiration or earlier termination, destroy all Data that is stored on Customer’s information technology systems or that is otherwise within Customer’s possession or control and will confirm in writing that Customer has complied with these obligations.
              <br />
              <br />
              4.3. Survival. All sections of these License Terms which by their nature should survive termination will survive termination, including, without limitation, accrued rights to payment, confidentiality obligations, warranty disclaimers, and limitations of liability.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              5. Compliance with Laws.
            </Heading>
            <br />
            <Text>5.1. Obligations. Customer must comply with all applicable federal, state and local laws, rules, regulations, and ordinances relating to telemarketing, data privacy, consumer protection, and any others laws that may relate to Customer’s use of the Subscription Services, Product, and Data, including, without limitation, the CAN-SPAM Act, the Telephone Consumer Protection Act, the General Data Protection Regulation of the European Union, and the California Consumer Privacy Act. Customer shall not, and shall not permit any third party to, license, sell, rent, lease, transfer, assign, distribute to any third party, or commercially exploit the Data, in whole or in part, or use the Data in connection with credit granting, credit monitoring, account review, collections, insurance underwriting, employment or any other purpose covered by the Fair Credit Reporting Act (“FCRA”), interpretations of the FCRA by the Federal Trade Commission, or by similar federal and state statutes.
              <br />
              <br />
              5.2. Indemnification. Customer agrees that Customer will indemnify, defend and hold AMAttendees harmless against any losses resulting from any third party claim against AMAttendees arising out of or in connection with any violation of any applicable law by Customer.</Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              6. Disclaimers; Limitation of Liability.
            </Heading>
            <br />
            <Text>6.1. Non-Reliance. The Data and the information presented on or through the Website, the Subscription Services, or the Product is made available solely for general information purposes. We do not warrant the accuracy, completeness, or usefulness of this Data or information. Any reliance Customer places on such Data information is strictly at Customer’s own risk. We disclaim all liability and responsibility arising from any reliance placed on such Data or information by Customer or any other visitor to the Website or Product user. We do not represent or warrant that Customer will obtain any minimum number of leads as a result of use of the Product or Data.
              <br />
              <br />
              6.2. Disclaimer. EXCEPT AS EXPRESSLY SET FORTH HEREIN, AMATTENDEES, FOR ITSELF AND ITS LICENSORS, MAKES NO EXPRESS, IMPLIED OR STATUTORY REPRESENTATIONS, WARRANTIES, OR GUARANTEES IN CONNECTION WITH THE WEBSITE, THE SUBSCRIPTION SERVICES, THE PRODUCT, OR ANY THIRD PARTY CONTENT, RELATING TO THE QUALITY, SUITABILITY, TRUTH, ACCURACY OR COMPLETENESS OF ANY INFORMATION, CONTENT, OR OTHER MATERIAL CONTAINED OR PRESENTED ON THE WEBSITE, THE PRODUCT, THE SUBSCRIPTION SERVICES OR THE DATA. UNLESS OTHERWISE EXPLICITLY STATED, TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE WEBSITE, THE SUBSCRIPTION SERVICES, THE PRODUCT, THE DATA, THE THIRD PARTY CONTENT, AND ANY OTHER INFORMATION, CONTENT OR MATERIAL CONTAINED OR PRESENTED ON THE WEBSITE IS PROVIDED TO CUSTOMER ON AN “AS IS,” “AS AVAILABLE” AND “WHERE-IS” BASIS WITH NO WARRANTY OF IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT OF THIRD PARTY RIGHTS. AMATTENDEES DOES NOT PROVIDE ANY WARRANTIES AGAINST VIRUSES, SPYWARE OR MALWARE THAT MAY BE INSTALLED ON CUSTOMER’S COMPUTER.
              <br />
              <br />
              6.3. Exclusion of Damages. TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO EVENT WILL AMATTENDEES, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH CUSTOMER’S USE, OR INABILITY TO USE, THE WEBSITE, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE WEBSITE, THE SUBSCRIPTION SERVICES, THE PRODUCT OR DATA, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER CAUSED BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE, EVEN IF FORESEEABLE.
              <br />
              <br />
              6.4. Aggregate Liability. TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO EVENT WILL THE AGGREGATE LIABILITY OF AMATTENDEES, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS ARISING OUT OF OR RELATED TO THESE TERMS OF USE, WHETHER ARISING UNDER OR RELATED TO BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER LEGAL OR EQUITABLE THEORY, EXCEED THE GREATER OF ONE HUNDRED DOLLARS ($100.00) AND THE TOTAL AMOUNTS PAID BY CUSTOMER TO US UNDER THESE TERMS OF USE IN THE TWELVE (12) MONTH PERIOD PRECEDING THE EVENT GIVING RISE TO THE CLAIM. THE FOREGOING LIMITATIONS APPLY EVEN IF ANY REMEDY FAILS OF ITS ESSENTIAL PURPOSE.</Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              7. Indemnification.
            </Heading>
            <br />
            <Text>7.1. Indemnification by Customer. Customer agrees to defend, indemnify, and hold harmless AMAttendees, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys’ fees) arising out of or relating to: (i) Customer’s violation of these License Terms or Customer’s use of the Product or the Data, including, but not limited to any use of the Product’s content, services, and products other than as expressly authorized in these License Terms or Customer’s use of any information obtained from the Product; (ii) allegation of facts that, if true, would constitute Customer’s breach of any of Customer’s representations, warranties, covenants, or obligations under this Agreement; (iii) gross negligence or willful misconduct by Customer or any Authorized User; (iv) any violation of any applicable law by Customer; (v) access to or use of the Product by Customer or any Authorized User in combination with any hardware, system, software, network, or other materials or service not provided by AMAttendees or specified for Customer’s use in the Documentation; or (vi) modification of the Product other than by or on behalf of AMAttendees or with AMAttendees’s prior written approval.

            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              8. Dispute Resolution.
            </Heading>
            <br />
            <Text>
              PLEASE READ THIS SECTION CAREFULLY – IT MAY SIGNIFICANTLY AFFECT CUSTOMER’S LEGAL RIGHTS, INCLUDING CUSTOMER’S RIGHT TO FILE A LAWSUIT IN COURT. THIS SECTION 8, INCLUDING THE PROVISIONS ON BINDING ARBITRATION AND CLASS ACTION WAIVER, SHALL SURVIVE ANY TERMINATION OR EXPIRATION OF THIS AGREEMENT.
              <br />
              <br />
              8.1. Governing Law. All matters relating to the Website, the Subscription Services, the Product, Data and these License Terms and any dispute or claim arising therefrom or related thereto shall be governed by and construed in accordance with the laws of Ontario, Canada without giving effect to any choice or conflict of law provision or rule.
              <br />
              <br />
              8.2. Federal Arbitration Act. Certain portions of this Section are deemed to be a “written agreement to arbitrate” pursuant to the Federal Arbitration Act (“FAA”). Customer and AMAttendees expressly agree and intend that this Section satisfies the “writing” requirement of the FAA. This Section can only be amended by mutual agreement.
              <br />
              <br />
              8.3. Binding Arbitration. CUSTOMER AND AMATTENDEES AGREE THAT ANY DISPUTE, CONTROVERSY, OR CLAIM ARISING OUT OF, OR RELATING TO CUSTOMER’S USE OF THE SUBSCRIPTION SERVICES, PRODUCT, AND/OR DATA UNDER THIS AGREEMENT SHALL BE RESOLVED ONLY BY FINAL AND BINDING ARBITRATION, except that (1) Customer may assert claims in small claims court within the scope of that court’s jurisdiction; and (2) this agreement to arbitrate does not limit Customer’s or AMAttendees’s right to seek injunctive or other equitable relief in state or federal court in Los Angeles County, California to prevent the actual or threatened infringement, misappropriation or violation of a party’s copyrights, trademarks, trade secrets, patents, or other intellectual property rights. To begin an arbitration proceeding, Customer must send a letter requesting arbitration and describing Customer’s claim to AMAttendees at . The arbitration will be conducted by JAMS in accordance with the JAMS Streamlined Arbitration Procedure Rules in effect at the time the arbitration is initiated, excluding any rules or procedures governing or permitting class actions. Payment of all filing, administration and arbitrator fees will be governed by JAMS’ rules. Customer can obtain JAMS’ procedures, rules, and fee information as follows: JAMS: 800.352.5267 and http://www.jamsadr.com. The arbitration will be conducted in the English language; the location of such arbitration shall be in Ontario, Canada. Each party will bear its own costs in the arbitration. The arbitrator will have full power and authority to determine issues of arbitrability and to interpret or construe the provisions of the agreement documents and to fashion appropriate remedies (including temporary, preliminary, interim, or permanent injunctive relief); provided that the arbitrator will not have any right or authority: (i) in excess of the authority that a court having jurisdiction over the parties and the dispute would have absent this arbitration agreement; or (ii) to award damages in excess of the types and limitation of damages found in the Agreement. Judgment upon the award may be entered in any court of competent jurisdiction.
              <br />
              <br />
              8.4. Class Action Waiver. CUSTOMER AND AMATTENDEES EACH AGREE THAT ANY DISPUTE RESOLUTION PROCEEDING WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED OR REPRESENTATIVE ACTION.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              9. General.
            </Heading>
            <br />
            <Text>
              If Customer violates these License Terms, AMAttendees may terminate and/or suspend Customer’s access to this Website without notice. AMAttendees prefers to advise Customer of Customer’s inappropriate behavior and to recommend any necessary corrective action. However, certain violations of these License Terms, as determined by AMAttendees, may result in immediate termination. If any of these License Terms is found to be inconsistent with applicable law, then such term shall be interpreted to reflect the intentions of the parties, and no other terms will be modified. AMAttendees’s failure to enforce any of these License Terms is not a waiver of such term. These License Terms are the entire agreement between Customer and AMAttendees and supersede all prior or contemporaneous negotiations, discussions or agreements between Customer and AMAttendees about the Website and/or the Product. Customer shall not assign or otherwise transfer any of Customer’s rights, or delegate or otherwise transfer any of Customer’s obligations or performance under these License Terms without our prior written consent.
              <br />
              <br />
              By using the Website and/or the Subscription Services, Customer consents to receiving electronic communications from us. These electronic communications may include, but are not limited to, notices about the applicable Subscription Services, Customer’s Subscription Plan, Fees, and transactional or other information concerning or related to the Website and/or the Subscription Services. These electronic communications are part of Customer’s relationship with Us and Customer receives them as part of Customer’s use of the Website and/or the Subscription Services. Customer agrees that any notices, agreements, disclosures or other communications that we send Customer electronically will satisfy any legal communication requirements, including that such communications be in writing.
              <br />
              <br />
              In no event will We be liable or responsible to Customer, or be deemed to have defaulted under or breached these License Terms, for any failure or delay in fulfilling or performing any term of these License Terms, when and to the extent such failure or delay is caused by any circumstances beyond our reasonable control (a “Force Majeure Event”), including acts of God, flood, fire, earthquake or explosion, war, terrorism, invasion, riot or other civil unrest, embargoes or blockades in effect on or after the date of these License Terms, national or regional emergency, strikes, labor stoppages or slowdowns or other industrial disturbances, passage of law or any action taken by a governmental or public authority, including imposing an embargo, export or import restriction, quota, or other restriction or prohibition or any complete or partial government shutdown, or national or regional shortage of adequate power or telecommunications or transportation. We may terminate this Agreement if a Force Majeure Event continues substantially uninterrupted for a period of sixty (60) days or more.
              <br />
              <br />
              If Customer has any questions, comments, or concerns regarding these License Terms, please <Link href="https://leadsinc.net/contact-us">contact us.</Link>
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              10. Notice for California Users.
            </Heading>
            <br />
            <Text>
              If you are a California resident, you may have these License Terms mailed to you electronically by contacting us with Customer’s email address and a request for the License Terms and any linked terms.
            </Text>
          </Box>

        </VStack>
      </Container>
    </Wrapper>
  );
};

export default TermsOfService;

export const getStaticProps: GetStaticProps = withCommonStaticProps(null, ["featuredProduct", "config"]);
