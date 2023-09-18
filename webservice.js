const axios = require("axios");
const xml2js = require("xml2js");

async function fetchMotorDetails() {
  const soapRequestXML = `
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">
      <soap:Header/>
      <soap:Body>
        <tem:GetMotordetailsforwebsite>
          <!--Optional:-->
          <tem:Para1>P</tem:Para1>
          <!--Optional:-->
          <tem:Para2>120321823750010735</tem:Para2>
          <!--Optional:-->
          <tem:Para3>m</tem:Para3>
          <!--Optional:-->
          <tem:Para4>123</tem:Para4>
          <!--Optional:-->
          <tem:Para5>Y</tem:Para5>
        </tem:GetMotordetailsforwebsite>
      </soap:Body>
    </soap:Envelope>
  `;

  const url =
    "http://dwhwsrvs.reliancegeneral.co.in/RGIWebService/Service1.asmx?wsdl";

  const headers = {
    "Content-Type": "application/soap+xml; charset=utf-8",
    "Content-Length": soapRequestXML.length,
    SOAPAction: "http://tempuri.org/GetMotordetailsforwebsite",
  };

  try {
    const response = await axios.post(url, soapRequestXML, { headers });

    const parser = new xml2js.Parser({ explicitArray: false });
    const parsedData = await parser.parseStringPromise(response.data);

    const soapResponseBody = parsedData["soap:Envelope"]["soap:Body"];

    if (
      soapResponseBody &&
      soapResponseBody.GetMotordetailsforwebsiteResponse
    ) {
      const responseData =
        soapResponseBody.GetMotordetailsforwebsiteResponse
          .GetMotordetailsforwebsiteResult;

      if (responseData && responseData["diffgr:diffgram"]) {
        const diffgram = responseData["diffgr:diffgram"];
        console.log("User Details:", diffgram.NewDataSet.Table);
      } else {
        console.error("Invalid SOAP response structure:", responseData);
      }
    } else {
      console.error("Invalid SOAP response structure:", soapResponseBody);
    }
  } catch (error) {
    console.error("Error making or processing SOAP request:", error);
  }
}

fetchMotorDetails();
