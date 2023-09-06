import {
    Catch,
    InternalServerErrorException,
    NotFoundException,
  } from "@nestjs/common";
  import { check } from "prettier";
  import { NlpDto } from "src/dto/nlp.dto";
  import { knowledge_base } from "src/entities/nlp.entity";
  import {
    EntityRepository,
    getConnection,
    getRepository,
    Repository,
  } from "typeorm";
  const { dockStart } = require("@nlpjs/basic");
  const fs = require("fs");
  import * as CUSTOM_DICTIONARY from "./dictionary.json";
  var Typo = require("typo-js");
  const axios = require("axios");
  var dictionary = new Typo("en_US");
  var stringSimilarity = require("string-similarity");
  import { Logger } from "@nestjs/common";
  import { leads } from "src/entities/leads.entity";
  var Sentiment = require("sentiment");
  var sentiment = new Sentiment();
  import { ocr } from "src/entities/ocr.entity";
  const moments = require("moment");
  import { decode, sign, verify } from "jsonwebtoken";
  import { session } from "src/entities/session.entity";
  import { user_data } from "src/entities/sebi.entity";
  import { feedback } from "src/entities/feedback.entity";
  import { data } from "src/entities/sebidata.entity";
  import { hrdata } from "src/entities/hrdata.entity";
  import { hrdata1 } from "src/add-on/hr";
  import { departmentdata } from "src/add-on/department";
  import { designationdata } from "src/add-on/designation";
  import { departmentcode } from "src/add-on/department_code";
  import { EmpId } from "src/add-on/EmpId";
  import { citydata } from "src/add-on/city";
  import { gradedata } from "src/add-on/Grade";
  import { shortFormReplacements } from "src/add-on/replace"
  
  
  @EntityRepository(knowledge_base)
  export class NlpRepository extends Repository<knowledge_base> {
    private logger = new Logger("BotRepository");
    private apiResponse;
    private userContext = new Map();
    private secret = "Token%^*((!@$5558";
  
    private ApiFallback = {
      en: {
        message: "Sorry, No Data found.",
        audio:
          "https://storage.corover.ai/chatbot-audio-bucket-aws/31667d5c-9305-4864-84de-a90860528bb8_en.mp3",
      },
  
      hi: {
        message: "क्षमा करें, कोई डेटा नहीं मिला।",
        audio:
          "https://storage.corover.ai/chatbot-audio-bucket-aws/00567581-5b0d-4efc-9122-a9d81773474c_hi.mp3",
      }
    };
    private ApiOptions = {
      en: [
        {
          "label": "Main Menu",
          "value": "=sebi_start2"
        },
        {
          "label": "I'm Done",
          "value": "=sebi_feedback"
        }
      ],
      hi: [
        {
          "label": "मुख्य मेन्यू",
          "value": "=sebi_start2"
        },
        {
          "label": "समाप्त करें",
          "value": "=sebi_feedback"
        }
      ]
    };
  
    private ApiResponse = {
      en: {
        answer: {
          contextCount: 1,
          response: "<p>Please find the details below.</p>",
          audio:
            "https://storage.corover.ai/chatbot-audio-bucket-aws/6770bbc3-9ee0-4a3d-8edb-9110ae0b0390_en.mp3",
        },
        classifications: [{ intent: "" }],
      },
  
      hi: {
        answer: {
          contextCount: 1,
          response: "<p>कृपया नीचे विवरण पाएं।</p>",
          audio:
            "https://storage.corover.ai/chatbot-audio-bucket-aws/c9758e83-d6c0-4bf4-8848-dc308c6b22cb_hi.mp3",
        },
        classifications: [{ intent: "" }],
      },
    };
    private ApiMultipleResponse = {
      en: {
        answer: {
          contextCount: 1,
          response: "<p>Please select one of the options below to get the details.</p>",
          audio:
            "https://storage.corover.ai/chatbot-audio-bucket-aws/0fc7f571-8f6f-4626-934b-07892bec9e78_en.mp3",
        },
        classifications: [{ intent: "" }],
      },
  
      hi: {
        answer: {
          contextCount: 1,
          response: "<p>विवरण प्राप्त करने के लिए कृपया नीचे दिए गए विकल्पों में से एक का चयन करें।</p>",
          audio:
            "https://storage.corover.ai/chatbot-audio-bucket-aws/f1461ee0-c818-4c55-aef4-435407d16899_hi.mp3",
        },
        classifications: [{ intent: "" }],
      },
    };
    async questions(headers, language) {
      const excludedColumnIds = [1700, 1701, 1702, 1705];
      const column = language === 'hi' ? 'Question_hi' : 'Question';
      const queryBuilder = getConnection()
        .createQueryBuilder()
        .select(`QuestionData.${column}`)
        .from(data, "QuestionData")
        .where("QuestionData.id NOT IN (:...excludedIds)", { excludedIds: excludedColumnIds });
  
      const questions = await queryBuilder.getMany();
      const questionStrings = questions.map((item) => item[column]);
  
      return questionStrings;
    }
  
  
    async getAnswer(nlpDto: NlpDto, language, headers, ipAddress) {
      let { query, cxpayload, userToken, feedback, source, contextLable } = nlpDto;
      var translatedValue: any;
      var value = false;
      if (headers.cxtoken) {
        try {
          verify(headers.cxtoken, this.secret);
        } catch (error) {
          value = true;
        }
      }
      // if (
      //   (!cxpayload && !headers.cxtoken && source != "WhatsApp") ||
      //   (value && !cxpayload)
      // ) {
      //   console.log("New User ==>");
      //   query = "=sebi_phone";
      // }
      if (feedback && feedback.flg == true) {
        return await this.saveFeedback(
          nlpDto,
          language,
          headers.appId,
          ipAddress
        );
      }
  
      const match = /^(register|registration|पंजीकरण|रजिस्ट्रेशन)$/i;
      if (match.test(query)) {
        query = "=sebi_reg";
      }
      const matches = /^(hi|hello)$/i;
      if (matches.test(query)) {
        query = "=sebi_start2";
      }
  
      if (language !== "en" && !query.startsWith("=")) {
        if (query.includes("-")) {
          query = query.replace(/-/g, " ");
        }
        translatedValue = await this.translationFn(query, language).then();
        // dashboard.translatedText = translatedValue;
        if (translatedValue) {
          query = await translatedValue;
        }
  
        console.log("Tranlated Value ===> ", translatedValue);
      }
  
      // console.log("Query check:->", query);
      var greetingcheck = await this.GreetingBasedOnTime(query);
      if (query != greetingcheck) {
        query = greetingcheck;
      }
      if (query.startsWith("=")) {
        nlpDto["algorithm"] = "Direct Match";
        if (query.includes("greeting")) {
          var response = await this.getDirectAnswer(
            query,
            language,
            "259e2487-eb90-4d54-8ec0-09f8a475395f"
          );
        } else {
          var response = await this.getDirectAnswer(
            query,
            language,
            headers.appId
          );
        }
        response["TranslatedQuery"] = translatedValue;
        // console.log("coming here", response);
      } else {
        query = query.toLowerCase();
        query = query.replace(/[^\w\s.]/gi, "");
        Logger.log("PROCESSING QUERY::::::", query);
  
        let updatedQuery = query;
        Object.keys(shortFormReplacements).forEach(shortForm => {
          const replacement = shortFormReplacements[shortForm];
          const regex = new RegExp(`\\b${shortForm}\\b`, "gi");
          updatedQuery = updatedQuery.replace(regex, replacement);
        });
        query = updatedQuery;
  
  
        // NAME, DESIGNATION, EMP ID // ONLY NAME
        const Des_Data = designationdata;
        const pattern = Des_Data.map(designation => designation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const match_data = new RegExp('\\b(' + pattern + ')', 'gi');
        const name_data = hrdata1;
        const name_Pattern = name_data.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const name_matches = new RegExp('\\b(' + name_Pattern + ')', 'gi');
  
        const name_match = new RegExp('\\b(' + name_Pattern + '|\\w+)\\b', 'gi');
        const EmpId_data = EmpId.map(id => String(id)).join('|');
        const empId_match = new RegExp('\\b(' + EmpId_data + ')\\b', 'gi');
  
        const match_name1 = query.match(name_matches);
        console.log("NAME_MATCH:", match_name1);
        
        const match_name = query.match(name_match);
        console.log("NAME_MATCH:", match_name);
  
        const DES_Match = query.match(match_data);
        console.log("DESIGNATION MATCHING:", DES_Match);
  
        const match_empId = query.match(empId_match);
        console.log("EMPID_MATCH:", match_empId);
        if (match_name1 && DES_Match && match_empId) {
          console.log("Both 'name', 'designation', and 'EmpId' found in the query.");
          const NameSet = new Set(match_name1);
          NameSet.delete('');
          const DesignationSet = new Set(DES_Match);
          DesignationSet.delete('');
          const EmpIdSet = new Set(match_empId);
          EmpIdSet.delete('');
          const filteredName = [...NameSet].join(', ');
          const filteredDesignation = [...DesignationSet].join(', ');
          const filteredEmpId = [...EmpIdSet].join(', ');
          return await this.GetEmp_data(nlpDto, language, filteredName, filteredDesignation, filteredEmpId);
        } else if (match_name && !DES_Match && !match_empId) {
          console.log("'name' found in the query.");
          const filteredName = match_name[0];
          return await this.GetName(nlpDto, language, filteredName);
        } else {
          console.log("'name' or 'designation' missing");
        }
        // NAME AND DESIGNATION
        const Designation = designationdata;
        const DesignationPatterns = Designation.map(designation => designation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const partialMatch = new RegExp('\\b(' + DesignationPatterns + ')', 'gi');
        const names = hrdata1;
        const namesPattern = names.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const partialMatchRegex = new RegExp('\\b(' + namesPattern + ')', 'gi');
        const matching = query.match(partialMatchRegex);
        console.log("NAME_MATCH:", matching);
        const assistantManagerMatches = query.match(partialMatch);
        console.log("DESIGNATION MATCHING:", assistantManagerMatches);
        if (matching && assistantManagerMatches) {
          console.log("Both 'name' and 'designation' found in the query.");
          const NameSet = new Set(matching);
          NameSet.delete('');
          const DesignationSet = new Set(assistantManagerMatches);
          DesignationSet.delete('');
          const filteredName = [...NameSet].join(', ');
          const filteredQuery = [...DesignationSet].join(', ');
          return await this.GetCombine(nlpDto, language, filteredName, filteredQuery);
        } else {
          console.log("'name' or 'designation' missing");
        }
        // // DESIGNATION, DEPARTMENT, AND CITY
        // const designation = designationdata;
        // const designationPattern = designation.map(d => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        // const designationRegex = new RegExp('\\b(' + designationPattern + ')', 'gi');
  
        // const departments = departmentdata;
        // const departmentPattern = departments.map(d => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        // const departmentRegex = new RegExp('\\b(' + departmentPattern + ')', 'gi');
  
        // const cities = citydata;
        // const cityPattern = cities.map(city => city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        // const cityRegex = new RegExp('\\b(' + cityPattern + ')', 'gi');
  
        // const desigMatches = query.match(designationRegex);
        // console.log("DESIGNATION===>", desigMatches);
  
        // const departMatching = query.match(departmentRegex);
        // console.log("DEPARTMENT==>", departMatching);
  
        // const cityMatching = query.match(cityRegex);
        // console.log("CITY MATCHING==>", cityMatching);
  
        // if (desigMatches && cityMatching && departMatching) {
        //   console.log("All 'designation', 'department', and 'city' found in the query.");
        //   const designationSet = new Set(desigMatches);
        //   designationSet.delete('');
        //   const departmentSet = new Set(departMatching);
        //   departmentSet.delete('');
        //   const citySet = new Set(cityMatching);
        //   citySet.delete('');
        //   const filteredDesignation = [...designationSet].join(', ');
        //   const filteredDepartment = [...departmentSet].join(', ');
        //   const filteredCity = [...citySet].join(', ');
        //   return await this.GetDesignationDepartmentAndCity(nlpDto, language, filteredDesignation, filteredDepartment, filteredCity);
        // } else if (desigMatches && cityMatching && !departMatching) {
        //   console.log("Both 'designation' and 'city' found in the query.");
        //   const designationSet = new Set(desigMatches);
        //   designationSet.delete('');
        //   const citySet = new Set(cityMatching);
        //   citySet.delete('');
        //   const filteredDesignation = [...designationSet].join(', ');
        //   const filteredCity = [...citySet].join(', ');
        //   return await this.GetDesignationDepartmentAndCity(nlpDto, language, filteredDesignation, '', filteredCity);
        // }
        // else if (departMatching && cityMatching && !desigMatches) {
        //   console.log("Both 'department', and 'city' found in the query.");
        //   const departmentSet = new Set(departMatching);
        //   departmentSet.delete('');
        //   const citySet = new Set(cityMatching);
        //   citySet.delete('');
        //   const filteredDepartment = [...departmentSet].join(', ');
        //   const filteredCity = [...citySet].join(', ');
        //   return await this.GetDepartmentAndCity(nlpDto, language, filteredDepartment, filteredCity);
        // }
        // else {
        //   console.log("'designation', 'department', or 'city' missing");
        // }
        // DESIGNATION AND DEPARTMENT
        const des = designationdata;
        const Data = des.map(des => des.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const Match = new RegExp('\\b(' + Data + ')', 'gi');
        const department = departmentdata;
        const dep_Pattern = department.map(dep => dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const DepartmentRegex = new RegExp('\\b(' + dep_Pattern + ')', 'gi');
        const departmentMatching = query.match(DepartmentRegex);
        console.log("DEPARTMENT MATCHING==>", departmentMatching);
        const designationMatches = query.match(Match);
        console.log("DESIGNATION MATCHING===>", designationMatches);
        if (departmentMatching && designationMatches) {
          console.log("Both 'department' and 'designation' found in the query.");
          const DepartmentSet = new Set(departmentMatching);
          DepartmentSet.delete('');
          const DesignationSet = new Set(designationMatches);
          DesignationSet.delete('');
          const filteredDepartment = [...DepartmentSet].join(', ');
          const filteredQuery = [...DesignationSet].join(', ');
          return await this.GetDepartment(nlpDto, language, filteredDepartment, filteredQuery);
        } else {
          console.log("'department' or 'designation' missing");
        }
  
  
  
        // GRADE AND DEPARTMENT // GRADE AND DESIGNATION
        const hasGradeKeyword = /\bgrade\b/i.test(query);
        if (hasGradeKeyword) {
          const DEPARTMENTs = departmentdata;
          const DEPARTMENTsPatterns = DEPARTMENTs.map(dep => dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
          const partiallMatches = new RegExp('\\b(' + DEPARTMENTsPatterns + ')', 'gi');
          const GRADE = gradedata;
          const Patterns = GRADE.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
          const partial = new RegExp('\\b(' + Patterns + ')\\b', 'gi');
          const designationData = designationdata;
          const designationPatterns = designationData.map(des => des.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
          const partialDesignation = new RegExp('\\b(' + designationPatterns + ')', 'gi');
  
          const match = query.match(partial);
          const Department_Matches = query.match(partiallMatches);
          const designationMatche = query.match(partialDesignation);
  
          console.log("GRADE MATCH:", match);
          console.log("Dep match:", Department_Matches);
          console.log("Designation match:", designationMatche);
  
          if (Department_Matches && match && !designationMatche) {
            console.log("Found 'grade' and 'department' in the query.");
            const filteredGrade = [...new Set(match)].join(', ');
            const filteredDepartment = [...new Set(Department_Matches)].join(', ');
            return await this.GetGrade(nlpDto, language, filteredGrade, filteredDepartment);
          } else if (match && designationMatche && !Department_Matches) {
            console.log("Found 'grade' and 'designation' in the query.");
            const filteredGrade = [...new Set(match)].join(', ');
            const filteredDesignation = [...new Set(designationMatche)].join(', ');
            return await this.GetDEsig_Grade(nlpDto, language, filteredGrade, filteredDesignation);
          } else {
            console.log("'GRADE', 'DEPARTMENT', or 'DESIGNATION' missing");
          }
        }
        // DESIGNATION AND DEPARTMENT CODE // ONLY Designation
        const desig = designationdata;
        const datamatch = desig.map(des => des.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const Matching = new RegExp('\\b(' + datamatch + ')', 'gi');
  
        const department_code = departmentcode;
        const dep_code = department_code.map(dep => '\\b' + dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').join('|');
        const DepartmentMatch = new RegExp('(' + dep_code + ')', 'gi');
  
        const departmentMatch = query.match(DepartmentMatch);
        console.log("DEPARTMENTs MATCHING:", departmentMatch);
  
        const designationMatch = query.match(Matching);
        console.log("DESIGNATIONs MATCHING:", designationMatch);
        const listFound = /\b(?:lists?|employe[es]*|employee[es]*)\b/i.test(query);
  
        if (departmentMatch && designationMatch) {
          console.log("Both 'department code' and 'designation' found in the query.");
          const filteredDepartment = departmentMatch[0];
          const DesignationSet = new Set(designationMatch);
          DesignationSet.delete('');
          const filteredDesignation = [...DesignationSet].join(', ');
          return await this.GetDepartment_code(nlpDto, language, filteredDepartment, filteredDesignation);
        } else if (!departmentMatch && designationMatch && listFound) {
          console.log("Only 'designation' found in the query.");
          const filteredDesignation = [...new Set(designationMatch)].join(', ');
          return await this.GetDepartment_code(nlpDto, language, '', filteredDesignation);
        } else if (departmentMatch && !designationMatch && listFound) {
          console.log("ONLY 'department code' found in the query.");
          const departSet = new Set(departmentMatch);
          departSet.delete('');
          const filteredDepartment = [...departSet].join(', ');
          return await this.GetCode(nlpDto, language, filteredDepartment);
        } else {
          console.log("'designation' or 'department code' missing");
        }
        // SEBI AND EMPLOYEE found in query
        const sebi = departmentdata;
        const sebi_Patterns = sebi.map(dep => dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const sebiMatches = new RegExp('\\b(' + sebi_Patterns + ')', 'gi');
        const SEBI_Match = query.match(sebiMatches);
        const hasSEBIAndEmployee = query.includes('sebi') && query.includes('employee(s)');
        if (SEBI_Match && hasSEBIAndEmployee) {
          console.log("'sebi,employee' and 'department' found in the query.");
          const filteredQuery = [...new Set(SEBI_Match)].join(', ');
          return await this.GetDATA(nlpDto, language, '', filteredQuery);
        } else {
          console.log("'name' or 'designation' missing");
        }
  
  
        // NAME AND DEPARTMENT // Only Department
        const dep = departmentdata.filter(department => department !== "SEBI");
        const Dep_Patterns = dep.map(dep => dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const partialMatches = new RegExp('\\b(' + Dep_Patterns + ')', 'gi');
        const Name = hrdata1;
        const namesPatterns = Name.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const partialRegex = new RegExp('\\b(' + namesPatterns + ')', 'gi');
        const matches = query.match(partialRegex);
        const Department_Match = query.match(partialMatches);
  
        if (Department_Match && !matches) {
          console.log("Only 'department' found in the query.");
          const filteredQuery = [...new Set(Department_Match)].join(', ');
          return await this.GetDATA(nlpDto, language, '', filteredQuery);
        } else if (matches && Department_Match) {
          console.log("Both 'name' and 'department' found in the query.");
          const filteredName = [...new Set(matches)].join(', ');
          const filteredQuery = [...new Set(Department_Match)].join(', ');
          return await this.GetDATA(nlpDto, language, filteredName, filteredQuery);
        } else {
          console.log("'name' or 'designation' missing");
        }
        // DEPARTMENT
        const Department_code_Match = /^(?=.*\b(?:departments?|offices?|divisions?)\b).*\blists?\b/i;
        const MATCH = Department_code_Match.test(query);
        if (MATCH) {
          console.log("'department' found in the query.");
          return await this.AllDepartment(nlpDto, language);
        } else {
          console.log("'department' missing");
        }
  
        var response;
  
        console.log("QUERY BEFORE NLP", query);
        response = await this.nlpEngine(query, language);
        console.log("");
        response = await this.nlpEngine(query, language);
        var data = await this.getDirectAnswer(response.intent, language, headers.appId);
        response.answer = data.answer;
        response["TranslatedQuery"] = translatedValue;
        // console.log(response);
      }
  
      if (response.status == 404) {
        let data = await this.getBharatGPT(query);
        if (data.Message === "list index out of range" || data.reply === "Sorry, I don't know") {
          return response = await this.getDirectAnswer("not_found", language, headers.appId)
        }
  
        var questioncheck = await this.GetQuery(data.reply, language);
  
        if (questioncheck.length > 0) {
          let answerKey = language === "hi" ? "Answer_hi" : "Answer";
          let audioKey = language === "hi" ? "Audio_hi" : "Audio_en";
  
          let answerPayload = JSON.stringify({
            id: "1",
            answer: questioncheck[0][answerKey],
            audio: questioncheck[0][audioKey],
          });
  
          nlpDto.answer = JSON.parse(answerPayload);
          nlpDto.intent = "Generative";
          let csentiments = await sentiment.analyze(query);
          let csesenti = await this.calculatesentiments(csentiments).then();
          csentiments.prediction = csesenti.prediction;
          nlpDto["sentiment"] = JSON.stringify(csentiments);
          nlpDto["ipAddress"] = ipAddress;
          nlpDto["algorithm"] = "BharatGPT";
  
          var savedDashboard = await this.saveToDashboard(nlpDto, language, headers.appId);
  
          const successResponse = {
  
            answer: {
              contextCount: 1,
              response: questioncheck[0][answerKey].replace(/\n/g, "<br>"),
              answerId: savedDashboard.answerId,
              userToken: savedDashboard.userToken,
              FAQ: data.reply,
              TextBox: true,
              options: this.ApiOptions[language] || [],
              audio: questioncheck[0][audioKey],
              TranslatedQuery: translatedValue
            },
          };
          return successResponse;
        }
      }
  
      if (response.status) {
  
        var transformobj = response;
        const newKeys = { message: "answer", error: "intent" };
        const renamedObj: any = await this.renameKeys(transformobj, newKeys);
        renamedObj.id = 1;
        nlpDto.answer = renamedObj;
        nlpDto["intent"] = "Not Found";
        let csentiments = await sentiment.analyze(query);
        let csesenti = await this.calculatesentiments(csentiments).then();
        csentiments["prediction"] = csesenti.prediction;
        nlpDto["sentiment"] = JSON.stringify(csentiments);
        nlpDto["ipAddress"] = ipAddress;
        nlpDto["algorithm"] = "No Match";
        //  Logger.log("transformed answer:-",renamedObj);
        var savedDashboard = await this.saveToDashboard(
          nlpDto,
          language,
          headers.appId
        );
        throw new NotFoundException(
          "Sorry 😥 I did't understand that, please rephrase or ask any other question."
        );
        // response=response.response;
      } else {
        // console.log(response);
  
        if (response.answer.leadType && cxpayload) {
          // console.log("Comeing here", cxpayload);
          await this.performDirect(response.answer.action, cxpayload, userToken);
        }
        if (response.answer.leadsType && contextLable) {
          // console.log("Comeing here", cxpayload);
          await this.performDirect(
            response.answer.action,
            { searchoption: query },
            userToken
          );
        }
  
        if (response.answer.ShowResult && cxpayload) {
          let payload: any = cxpayload;
          var userdata: any = this.userContext.get(userToken);
          var HRData = await this.GetHRData(
            payload.userInput,
            userdata.searchoption,
            language
          );
          if (HRData.length === 1) {
            response.answer.TextBox = true;
            response.answer.response = response.answer.ValidationMessage.message;
            response.answer.audio = response.answer.ValidationMessage.audio;
            response.answer["searchSelection"] = userdata.searchoption;
            response.answer["data"] = HRData;
            console.log("Result:", HRData);
          } else if (HRData.length > 0) {
            response.answer["searchSelection"] = userdata.searchoption;
            response.answer["data"] = HRData;
          } else {
            response.answer["response"] = this.ApiFallback[language].message;
            response.answer["audio"] = this.ApiFallback[language].audio;
          }
          this.clearContext(userToken);
        }
  
        if (response.answer.resultshow && cxpayload) {
          let payload: any = cxpayload;
          var userdata: any = this.userContext.get(userToken) || {};
          userdata["userToken"] = userToken;
          userdata["appId"] = headers.appId;
  
          var usercheck = await this.GetUserData(userdata.mobile_number, headers.appId);
  
          if (usercheck.length > 0) {
            response = await this.getDirectAnswer("sebi_userexist", language, headers.appId);
            response.answer.response = response.answer.response.replace("***", usercheck[0].Firstname);
          }
  
          var savedata = await this.BasicInfoSave(userdata, headers.appId);
          response.answer["data"] = savedata;
          if (savedata !== null) {
            response.answer.response = response.answer.response.replace("**", savedata.leadsSave["Firstname"]);
          } else {
          }
          const audioResult = await this.dynamicVoiceAPI(
            response.answer.response,
            language
          );
          response.answer.audio = audioResult["Uploaded URL"];
        }
        if (
          response &&
          response.answer &&
          response.answer.api &&
          source != "WhatsApp"
        ) {
          if (response.answer.api) {
            if (response.answer.actionToDo == "OTP-SEND") {
              var data = await this.OtpApICall(response.answer, cxpayload);
              if (data.Status != "Success") {
                let ValidationMsg = response.answer.apiValidationMessage.message;
                let ValidationAudio = response.answer.apiValidationMessage.audio;
                response = await this.getDirectAnswer("=sebi_exist", language, headers.appId);
                response.answer.response = ValidationMsg;
                response.answer.audio = ValidationAudio;
              }
              var mobileNumber: any = cxpayload;
              response.answer.response = await response.answer.response.replace(
                "**mobileNumber**",
                mobileNumber.mobile_number
              );
              delete response.answer.retry_next_context;
              response.Api = data;
            }
            // console.log("OTP MATCHED check 0", response);
            if (response.answer.actionToDo == "OTP-VERIFY") {
              var data = await this.OtpApICall(response.answer, cxpayload);
              if (data.Details != "OTP Matched") {
                let ValidationMsg = response.answer.apiValidationMessage.message;
                let ValidationAudio = response.answer.apiValidationMessage.audio;
                const otpuuid = cxpayload["otpuuid"];
                response = await this.getDirectAnswer("=sebi_otp", language, headers.appId);
                response.answer.response = ValidationMsg;
                response.answer.audio = ValidationAudio;
                response.Api = {
                  "Details": otpuuid,
                  "Status": "Success"
                };
              } else {
                var userdata: any = this.userContext.get(userToken);
                var usercheck = await this.GetUserData(userdata.mobile_number, headers.appId);
                if (usercheck.length === 0) {
  
                  response = await this.getDirectAnswer("sebi_notexist", language, headers.appId);
                } else {
  
                  response = await this.getDirectAnswer("sebi_start", language, headers.appId);
                }
  
                delete response.answer.next_id;
                delete response.answer.user_input;
                delete response.answer.retry_next_context;
                delete response.answer.cxpayload;
                delete response.answer.api;
              }
            }
          }
        }
  
        if (response.answer.feedback && cxpayload) {
          let payload: any = cxpayload;
          var userdata: any = this.userContext.get(userToken) || {};
          userdata["userToken"] = userToken;
          userdata["appId"] = headers.appId;
  
          var savefeedback = await this.UserFeedback(userdata, headers.appId);
          response.answer["data"] = savefeedback;
  
        }
        if (response.answer.departmentlist && contextLable) {
          const Department = await this.AllDepartment(headers, language);
          if (Department && Array.isArray(Department.answer.Dep)) {
            response.answer.Dept = Department.answer.Dep;
          }
        }
  
  
  
  
        // if (
        //   response.answer.leadsave &&
        //   response.answer.leadsave == "save_user_data" &&
        //   cxpayload &&
        //   source != "WhatsApp"
        // ) {
        //   let payload: any = cxpayload;
        //   var userdata: any = this.userContext.get(userToken);
        //   userdata["pancard"] = payload.pancard;
        //   userdata["userToken"] = userToken;
        //   var branchData = await this.BasicInfoSave(userdata, headers.appId);
  
        //   try {
        //     verify(headers.cxtoken, this.secret);
        //   } catch (error) {
        //     var value = true;
        //   }
        //   // console.log(value);
        //   if (!headers.cxtoken && value) {
        //     var Token = sign(
        //       {
        //         userdata,
        //       },
        //       this.secret,
        //       { expiresIn: "1 days" }
        //     );
        //     var temp = {
        //       Token: Token,
        //       userToken: userToken,
        //     };
        //     await this.SaveSession(temp, headers.appId);
        //     // var userInfo = verify(Token, this.secret);
        //     // console.log(userInfo);
        //     response.answer["cxtoken"] = Token;
        //   }
        //   // response.answer["data"] = branchData;
        // }
        if (
          response.answer &&
          response.answer.locationSave &&
          cxpayload &&
          source != "WhatsApp"
        ) {
          await this.SaveLocation(cxpayload, userToken);
        }
        if (response.classifications && language != "en") {
          nlpDto["intent"] = response.classifications[0].intent;
          var transformobj = response.answer;
        } else {
          if (query.startsWith("=")) {
            nlpDto["intent"] = query.split("=")[1];
          } else {
            nlpDto["intent"] = response.classifications[0].intent;
            //   if (nlpDto.intent == "greeting") {
            //     const rndInt = await this.randomIntFromInterval(0, 2);
            //     response = this.randomreponses[rndInt];
            //   }
          }
        }
        if (response.answer) {
          if (response.answer.response.includes("EKO")) {
            response.answer.response = response.answer.response.replace(
              "EKO",
              "AskSEBI"
            );
            response.answer.audio =
              "https://storage.corover.ai/chatbot-audio-bucket-aws/a272535b-5208-417d-a80c-083d21ab4e59_en.mp3";
          }
        }
  
        var transformobj = response.answer;
        const newKeys = { response: "answer", contextCount: "id" };
        const renamedObj: any = await this.renameKeys(transformobj, newKeys);
        nlpDto.answer = renamedObj;
        // console.log("transformed answer:-",renamedObj);
        let csentiments = await sentiment.analyze(query);
        let csesenti = await this.calculatesentiments(csentiments).then();
        csentiments["prediction"] = csesenti.prediction;
        nlpDto["sentiment"] = JSON.stringify(csentiments);
        nlpDto["ipAddress"] = ipAddress;
        if (!nlpDto["algorithm"]) nlpDto["algorithm"] = "AI/ML";
        // console.log("Data what is going", nlpDto);
        var savedDashboard = await this.saveToDashboard(
          nlpDto,
          language,
          headers.appId
        );
        response.answer["answerId"] = savedDashboard.answerId;
        response.answer["userToken"] = savedDashboard.userToken;
      }
  
      // console.log(response);
      return response;
    }
  
    async getDirectAnswer(query: string, language, appId) {
      if (language == "hi") {
        try {
          let q = query.replace(/=/g, "");
          console.log(q);
          let result = await this.find({
            select: ["answers_hi"],
            where: {
              intent: q,
              appId: appId,
            },
          });
          if (result.length != 0) {
            return result[0].answers_hi[0];
          } else {
            throw new NotFoundException("Answer Not Found");
          }
        } catch (err) {
          return err;
        }
      } else if (language == "mr") {
        try {
          let q = query.replace(/=/g, "");
          let result = await this.find({
            select: ["answers_mr"],
            where: {
              intent: q,
              appId: appId,
            },
          });
  
          if (result.length != 0) {
            return result[0].answers_mr[0];
          } else {
            throw new NotFoundException("Answer Not Found");
          }
        } catch (err) {
          return err;
        }
      } else {
        try {
          // console.log("Query==>",query);
          let q = query.replace(/=/g, "");
          // console.log("Query==>",q);
          let result = await this.find({
            select: ["answers"],
            where: {
              intent: q,
              appId: appId,
            },
          });
          // console.log("result==>",result);
          if (result.length != 0) {
            return result[0].answers[0];
          } else {
            throw new NotFoundException("Answer Not Found");
          }
        } catch (err) {
          return err;
        }
      }
    }
  
    async SaveSession(userdata, appId) {
      console.log("SaveSession before saving=>", userdata);
      let SessionSave = new session();
      SessionSave.jwt_token = userdata.Token;
      SessionSave.token_gen_time = new Date().toISOString();
      var tomorrow = new Date(
        new Date().setDate(new Date().getDate() + 1)
      ).toISOString();
      SessionSave.token_exp = tomorrow;
      SessionSave.userToken = userdata.userToken;
      SessionSave.appId = appId;
  
      try {
        await session.save(SessionSave);
  
        return {
          response: "Data Save to Dashboard successfully",
          userToken: SessionSave.userToken,
        };
      } catch (error) {
        console.log(error);
      }
    }
    async getAnswerflow(query: string, language) {
      if (language == "hi") {
        try {
          let q = query.replace(/=/g, "");
          console.log(q);
          let result = await this.find({
            select: ["answers_hi", "intent"],
            where: {
              intent: q,
            },
          });
          // console.log(result);
          if (result.length != 0) {
            return result;
          } else {
            throw new NotFoundException("Answer Not Found");
          }
        } catch (err) {
          return err;
        }
      } else if (language == "mr") {
        try {
          let q = query.replace(/=/g, "");
          let result = await this.find({
            select: ["answers_mr", "intent"],
            where: {
              intent: q,
            },
          });
  
          if (result.length != 0) {
            return result;
          } else {
            throw new NotFoundException("Answer Not Found");
          }
        } catch (err) {
          return err;
        }
      } else {
        try {
          // console.log("Query==>",query);
          let q = query.replace(/=/g, "");
          // console.log("Query==>",q);
          let result = await this.find({
            select: ["answers", "intent"],
            where: {
              intent: q,
            },
          });
          // console.log("result==>",result);
          if (result.length != 0) {
            return result;
          } else {
            throw new NotFoundException("Answer Not Found");
          }
        } catch (err) {
          return err;
        }
      }
    }
    async randomIntFromInterval(min, max) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    async SaveLocation(cxpayload, userToken) {
      var leadData = new leads();
      leadData.location = cxpayload;
      try {
        await this.createQueryBuilder()
          .update(leads)
          .set(leadData)
          .where("userToken = :userToken", {
            userToken: userToken,
          })
          .execute();
      } catch (error) {
        this.logger.error(error);
      }
    }
  
    async nlpEngine(query: string, language) {
      Logger.log("::::::::::::NLP STARTED::::::::::");
      try {
        const dockConfiguration = {
          activation: "leaky-relu",
          hiddenLayers: [],
          learningRate: 0.1,
          timeout: 60 * 1000,
          console: {
            debug: true,
          },
          use: ["Basic", "ConsoleConnector"],
        };
        // { use: ['Basic', 'ConsoleConnector'] }
        const dock = await dockStart(dockConfiguration);
        var model;
        model = fs.readFileSync("Sebi_en.nlp", "utf8");
        const nlp = dock.get("nlp");
        nlp.import(model);
        Logger.log(query);
        // let queryToAry = query.split(" ");
        // let tokenization = await removeStopwords(queryToAry);
        // return await this.checkTypo(tokenization);
        // let typoClassified = await this.checkTypo(tokenization);
  
        // query = typoClassified.tokenization.join(" ");
        // Logger.log("AFTER Tokenize=>", query);
        const response = await nlp.process("en", query);
  
        console.log("NLP RESPONSE", response);
  
        let res = {
          answers: [...new Set(response.answers.map((item) => item.id))],
          answer: response.answer,
          nlu: response.nluAnswer
            ? response.nluAnswer.classifications.filter((i) => i.score)
            : false,
          sentiment: response.sentiment,
          classifications: response.classifications.filter((i) => i.score),
          intent: response.intent,
        };
  
        console.log(res);
        Logger.log("::::::::::::NLP STOPED::::::::::");
        if (!res.intent || res.intent == "None") {
          throw new NotFoundException(
            "Sorry 😥 I did't understand that, please rephrase or ask any other question."
          );
        }
  
        // return {
        //   answer: res.answer,
        //   sentiment: res.sentiment,
        //   classifications: res.classifications,
        //   typo: typoClassified.corrections,
        // };
  
        // && res.classifications[0].score > 0.7
        if (
          res.classifications.length != 0 &&
          res.classifications[0].score > 0.75
        ) {
          if (res.nlu && res.answers.length > 1) {
            return {
              suggestions: res.answers,
              sentiment: res.sentiment,
              classifications: res.classifications,
              intent: res.intent,
            };
          } else {
            return {
              answer: res.answer,
              sentiment: res.sentiment,
              classifications: res.classifications,
              intent: res.intent,
            };
          }
        } else {
          throw new NotFoundException(
            "Sorry 😥 I did't understand that, please rephrase or ask any other question."
          );
        }
      } catch (err) {
        return err;
      }
  
      // return res;
    }
    async GreetingBasedOnTime(query) {
      const greeting_arr = [
        "good morning",
        "gud mrng",
        "very good morning",
        "good moning",
        "good night",
        "gud night",
        "very good night",
        "good afternoon",
        "afternoon",
        "very good afternoon",
        "gud afternoon",
        "good evening",
        "gud evening",
        "good knight",
      ];
  
      const matches = stringSimilarity.findBestMatch(query, greeting_arr);
      const d = new Date();
      const time = parseInt(
        d.toLocaleString("de-DE", {
          hour: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        })
      );
      if (matches.bestMatch.rating > 0.75) {
        if (time >= 5 && time < 12) {
          query = "Good morning";
        } else if (time >= 12 && time < 17) {
          query = "Good afternoon";
        } else if (time >= 17 && time < 19) {
          query = "Good evening";
        } else {
          query = "Good night";
        }
      }
  
      return query;
    }
  
    async checkTypo(tokenization) {
      let DICTIONARY = CUSTOM_DICTIONARY["default"];
      let corrections = [];
      let foundInSuggetions = false;
      for (let words of tokenization) {
        Logger.log("tokenization::::::", JSON.stringify(tokenization));
        if (!dictionary.check(words)) {
          Logger.log(`FIND TYPO IN ::::::::`, words);
          let suggetions = dictionary.suggest(words);
          Logger.log(`GOT suggetions ::::::::`, suggetions);
          for (const suggestWord of suggetions) {
            if (DICTIONARY.includes(suggestWord)) {
              DICTIONARY.indexOf(suggestWord);
              Logger.log(
                "suggestWord Match ::::::",
                DICTIONARY[DICTIONARY.indexOf(suggestWord)]
              );
  
              let correct = {
                word: tokenization[tokenization.indexOf(words)],
                corrected: DICTIONARY[DICTIONARY.indexOf(suggestWord)],
              };
              corrections.push(correct);
              tokenization[tokenization.indexOf(words)] =
                DICTIONARY[DICTIONARY.indexOf(suggestWord)];
              foundInSuggetions = true;
              break;
            }
          }
  
          if (!foundInSuggetions) {
            Logger.log(dictionary.check(words));
            let correctedValue = stringSimilarity.findBestMatch(
              words,
              DICTIONARY
            );
            Logger.log(
              "FOUND MORE HARDER:::::",
              JSON.stringify(correctedValue.bestMatch)
            );
            if (correctedValue.bestMatch.rating > 0.4) {
              Logger.log(correctedValue.bestMatch);
              let correct = {
                word: tokenization[tokenization.indexOf(words)],
                corrected: correctedValue.bestMatch.target,
              };
              corrections.push(correct);
              tokenization[tokenization.indexOf(words)] =
                correctedValue.bestMatch.target;
            }
            Logger.log(dictionary.suggest(words));
          }
        }
      }
      Logger.log("After typo:::", tokenization);
      return {
        tokenization,
        corrections,
      };
    }
    async OtpApICall(response, cxpayload) {
      response.host = await response.host.replace(
        "**mobileNumber**",
        cxpayload.mobile_number
      );
      response.host = await response.host.replace(
        "**otpuuid**",
        cxpayload.otpuuid
      );
      response.host = await response.host.replace("**otp**", cxpayload.otp);
  
      let axiosConfig = {
        headers: response.headers,
      };
      // console.log("response.host==>", response.host);
      await axios
        .get(response.host, axiosConfig)
        .then(async (res) => {
          this.apiResponse = res.data;
          console.log(res.data);
        })
        .catch((err) => {
          // console.log("AXIOS ERROR: ", err);
          this.apiResponse = err;
        });
      return await this.apiResponse;
    }
  
    async saveFeedback(nlpDto, language, appId, ipAddress) {
      const { feedback } = nlpDto;
      const feedbackPayload = feedback;
  
      delete nlpDto.feedback;
  
      nlpDto["intent"] = "feedback";
      nlpDto["answer"] = {
        id: "1",
        answer: "Thank you for your feedback.",
        audio:
          "https://coroverbackendstorage.blob.core.windows.net/chatbot-audio-bucket/79ea4d1b-670f-4755-b55f-e1149b6d5239_en.mp3",
      };
  
      nlpDto["sentiment"] = JSON.stringify({
        score: 0,
        comparative: 0,
        calculation: [],
        tokens: [],
        words: [],
        positive: [],
        negative: [],
        prediction: "Neutral",
      });
      nlpDto["ipAddress"] = ipAddress;
      let response = await this.saveToDashboard(nlpDto, language, appId);
  
      let answerId = response.answerId;
  
      let updateFeedback = await this.updateFeedback(feedback, answerId, appId);
  
      return updateFeedback;
    }
  
    async updateFeedback(feedback, answerId, appId) {
      let payload = {
        answerId: answerId,
        feedback: feedback.feedback,
        comment: feedback.comment,
      };
      let apiResponse = null;
  
      let axiosConfig = {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          appId: appId,
        },
      };
      await axios
        .post(
          `https://analytics.corover.ai/contextapi/dashboard/feedback`,
          payload,
          axiosConfig
        )
        .then(async (res) => {
          apiResponse = await res.data;
        })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
  
      return apiResponse;
    }
  
    async saveToDashboard(nlpDto, language, appId) {
      var payload = nlpDto;
      payload.query = payload.query.replace(/[23]/g, '');
      payload.query = payload.query.replace(/(sebi[._]|term)/gi, '');
      payload.query = payload.query.toUpperCase();
      let apiResponse = null;
      let axiosConfig = {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          appId: appId,
        },
      };
  
      await axios
        .post(
          `https://analytics.corover.ai/contextapi/dashboard/savetobaildashboard/${language}`,
          payload,
          axiosConfig
        )
        .then(async (res) => {
          apiResponse = await res.data.response;
          // console.log("Sanitize==>",apiResponse);
        })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });
      return apiResponse;
    }
  
    async renameKeys(obj, newKeys) {
      const keyValues = Object.keys(obj).map((key) => {
        const newKey = newKeys[key] || key;
        return { [newKey]: obj[key] };
      });
      return Object.assign({}, ...keyValues);
    }
  
    translationFn(query, language) {
      // let endbpoint = encodeURIComponent()
      return new Promise((resolve, reject) => {
        axios
          .get(
            `https://www.googleapis.com/language/translate/v2?key=AIzaSyCAPKjw4U8MgkXrcXh1xEuogF3TQopKyac&source=${language}&target=en&q=${encodeURIComponent(
              query
            )}`
          )
          .then(function (response) {
            // handle success
            // resolve(response);
            // console.log(response);
            resolve(response.data.data.translations[0].translatedText);
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          });
  
        // translate(query, null, "en")
        //   .then((res) => {
        //     resolve(res.translation);
        //     console.log("BING ==>", res.translation);
        //   })
        //   .catch((err) => {
        //     console.error(err);
        //   });
      });
    }
    async detectLanguage(input) {
      const englishRegex = /^[a-zA-Z\s.'-]*$/;
      const hindiRegex = /^[\u0900-\u097F\s]*$/;
  
      if (englishRegex.test(input)) {
        return 'en';
      } else if (hindiRegex.test(input)) {
        return 'hi';
      } else {
        return 'unknown';
      }
    }
  
    async GetHRData(userInput, searchOption, language) {
      console.log(userInput, searchOption, language);
      const detected = await this.detectLanguage(userInput);
      let translatedInput = userInput;
      if (language === 'hi') {
        translatedInput = await this.translationFn(userInput, 'hi');
      }
      const fieldName = detected === 'en' ? 'Match_name' : 'Name';
      // console.log("===>", fieldName)
  
      // console.log("translatedInput===>", translatedInput)
  
      switch (searchOption) {
        case "=hrlocator.name":
          const emp_name = await getConnection()
            .createQueryBuilder()
            .select([
              "HR_Name.Employee_Id",
              "HR_Name.Name",
              "HR_Name.Designation",
              "HR_Name.Department",
              "HR_Name.Department_Name",
              "HR_Name.Locations_Type",
              "HR_Name.Mail",
              "HR_Name.Grade",
              "HR_Name.Landline_No"
            ])
            .from(hrdata, "HR_Name")
            .where(`HR_Name.${fieldName} ILIKE :userInput`, {
              userInput: `%${userInput}%`,
            })
            .andWhere("HR_Name.language = :language", { language: language })
            .getMany();
  
  
          return emp_name;
  
        case "=hrlocator.designation":
          const designation = await getConnection()
            .createQueryBuilder()
            .select([
              "designation.Employee_Id",
              "designation.Name",
              "designation.Designation",
              "designation.Department",
              "designation.Department_Name",
              "designation.Mail",
              "designation.Grade",
              "designation.Landline_No"
            ])
            .from(hrdata, "designation")
            .where(`designation.Match_Designation ILIKE :userInput`, {
              userInput: `${translatedInput}`,
            })
            .andWhere("designation.language = :language", {
              language: language,
            })
            .getMany();
          return designation;
  
        case "=hrlocator.department_name":
          const department_name = await getConnection()
            .createQueryBuilder()
            .select([
              "HR-Department_Name.Employee_Id",
              "HR-Department_Name.Name",
              "HR-Department_Name.Designation",
              "HR-Department_Name.Department",
              "HR-Department_Name.Department_Name",
              "HR-Department_Name.Mail",
              "HR-Department_Name.Grade",
              "HR-Department_Name.Landline_No"
            ])
            .from(hrdata, "HR-Department_Name")
            .where(`HR-Department_Name.Match_Department_name ILIKE :userInput`, {
              userInput: `%${translatedInput}%`,
            })
            .andWhere("HR-Department_Name.language = :language", { language: language })
            .getMany();
          return department_name;
      }
    }
    async calculatesentiments(calsenti) {
      console.log("value", calsenti.comparative);
      if (calsenti.comparative > 0) {
        console.log("between 0 % and 0 %");
        let senti = "Positive";
        return Promise.resolve({ prediction: senti });
      } else if (calsenti.comparative < 0) {
        console.log("between 1 % and 1%");
        let senti = "Negative";
        return Promise.resolve({ prediction: senti });
      } else if (
        calsenti.comparative == 0 &&
        calsenti.positive.length >= 1 &&
        calsenti.negative.length >= 1
      ) {
        let senti = "Mixed";
        return Promise.resolve({ prediction: senti });
      } else if (
        calsenti.comparative == 0 &&
        calsenti.positive.length == 0 &&
        calsenti.negative.length == 0
      ) {
        let senti = "Neutral";
        return Promise.resolve({ prediction: senti });
      }
    }
    async BasicInfoSave(userdata, appId) {
      console.log("check data before saving=>", userdata);
      var usercheck = await this.GetUserData(userdata.mobile_number, appId);
  
      if (usercheck.length > 0) {
        console.log('User with mobile number already exists. Data not saved.');
        return null;
      }
      let leadsSave = new user_data();
      leadsSave.Firstname = userdata.first_name;
      leadsSave.Lastname = userdata.last_name;
      leadsSave.age = userdata.age;
      leadsSave.gender = userdata.gender;
      leadsSave.language = userdata.language;
      leadsSave.mobilenumber = userdata.mobile_number;
      leadsSave.userToken = userdata.userToken;
      leadsSave.appId = appId;
      leadsSave.dtm = new Date().toISOString();
  
      // Check if any required property is undefined or null
      if (!leadsSave.Firstname || !leadsSave.Lastname || !leadsSave.age || !leadsSave.gender || !leadsSave.mobilenumber) {
        console.log('Some required properties are missing. Data not saved.');
        return null;
      }
  
      try {
        await user_data.save(leadsSave);
  
        return {
          leadsSave,
        };
      } catch (error) {
        console.log(error);
        return null;
      }
    }
    async UserFeedback(userdata, appId) {
      console.log("check data before saving=>", userdata);
  
      let feedbackData = new feedback();
      feedbackData.appId = appId;
      feedbackData.userToken = userdata.userToken;
      feedbackData.Rating_1 = userdata.Rating_1;
      feedbackData.Rating_2 = userdata.Rating_2;
      feedbackData.feedback = userdata.feedback;
      feedbackData.dtm = new Date().toISOString();
  
      try {
        await feedbackData.save();
        return {
          feedbackData,
        };
      } catch (error) {
        console.log(error);
        return null;
      }
    }
  
    async OCRdataSave(userdata, userToken) {
      let OcrSave = new ocr();
      // console.log(new Date().toISOString());
      OcrSave.name = userdata.name;
  
      var darr = userdata.dob.split("/"); // ["25", "09", "2019"]
      var ISOFormat = new Date(
        parseInt(darr[2]),
        parseInt(darr[1]) - 1,
        parseInt(darr[0])
      );
      OcrSave.dob = ISOFormat.toISOString();
      OcrSave.fathername = userdata.fathername;
      OcrSave.document_url = userdata.document_Url;
      OcrSave.pannumber = userdata.pannumber;
      OcrSave.serviceid = Math.floor(Math.random() * 1000000000);
      OcrSave.userToken = userToken;
      OcrSave.appId = userdata.appId;
      try {
        await ocr.save(OcrSave);
  
        return OcrSave;
      } catch (error) {
        console.log(error);
      }
    }
    clearContext(userToken: string): void {
      if (this.userContext.has(userToken)) {
        this.userContext.delete(userToken);
      }
    }
    async performDirect(action, cxInfo, userToken: string) {
      console.log(action, cxInfo, userToken);
      let prevUserContext = {};
      const params = action["paramName"].split(",");
  
      for (const param of params) {
        console.log("==>", param);
        if (this.userContext.has(userToken)) {
          prevUserContext = this.userContext.get(userToken);
        }
        prevUserContext[param] = cxInfo[`${param}`];
        console.log(userToken, prevUserContext);
        this.userContext.set(userToken, prevUserContext);
  
        this.logger.log(
          `Current state of USER CONTEXT for USER: ${userToken}  :::::::::   ${JSON.stringify(
            this.userContext.get(userToken)
          )}`
        );
      }
    }
    async GetUserData(mobilenumber, appId) {
      console.log(mobilenumber, appId);
      const user = await getConnection()
        .createQueryBuilder()
        .select("UsersData")
        .from(user_data, "UsersData")
        .where("UsersData.mobilenumber = :mobilenumber", {
          mobilenumber,
        })
        .andWhere("UsersData.appId = :appId", {
          appId,
        })
        .getMany();
      return user;
    }
    async GetQuery(Question, language) {
      console.log(Question, language);
      const user = await getConnection()
        .createQueryBuilder()
        .select("QuestionData")
        .from(data, "QuestionData")
        .where("QuestionData.Question = :Question", {
          Question,
        })
        .getMany();
      return user;
    }
  
    async GetFeedbackData(leadsdto, headers: any) {
      var start = new Date(`"${leadsdto.fromDate}"`).toISOString();
      var endWith = new Date(`"${leadsdto.toDate}"`).toISOString();
      console.log(start, endWith);
      var end = moments(endWith, "YYYY-MM-DDThh:mm:sss")
        .add(1, "day")
        .format("YYYY-MM-DDThh:mm:sss");
      end = end.split("T")[0] + "T" + "18:30:00Z";
      // console.log(start, end, headers);
      const user = await getConnection()
        .createQueryBuilder()
        .select("FeedbackData")
        .from(feedback, "FeedbackData")
        .where(`FeedbackData.dtm BETWEEN :begin AND :end`, {
          begin: start,
          end: end,
        })
        .andWhere(`FeedbackData.appId =:appId`, {
          appId: headers.appId,
        })
        .getMany();
      return user;
    }
    async GetUsers(leadsdto, headers: any) {
      var start = new Date(`"${leadsdto.fromDate}"`).toISOString();
      var endWith = new Date(`"${leadsdto.toDate}"`).toISOString();
      console.log(start, endWith);
      var end = moments(endWith, "YYYY-MM-DDThh:mm:sss")
        .add(1, "day")
        .format("YYYY-MM-DDThh:mm:sss");
      end = end.split("T")[0] + "T" + "18:30:00Z";
      // console.log(start, end, headers);
      const user = await getConnection()
        .createQueryBuilder()
        .select("UserData")
        .from(user_data, "UserData")
        .where(`UserData.dtm BETWEEN :begin AND :end`, {
          begin: start,
          end: end,
        })
        .andWhere(`UserData.appId =:appId`, {
          appId: headers.appId,
        })
        .getMany();
      return user;
    }
  
    async AllDepartment(headers, language) {
      const designation = await getConnection()
        .createQueryBuilder()
        .select([
          "designation.Department",
          "designation.Department_Name",
        ])
        .distinct(true)
        .from(hrdata, "designation")
        .where(
          `(LOWER(designation.language) = LOWER(:language))
          AND (designation.Department IS NOT NULL AND designation.Department_Name IS NOT NULL)`,
          {
            language: language,
          }
        )
        .andWhere("NOT (designation.Department = '' AND designation.Department_Name = '')")
        .getMany();
  
      const uniqueDesignationNames = new Set();
      const uniqueDesignation = designation.filter((item) => {
        if (uniqueDesignationNames.has(item.Department_Name)) {
          return false;
        }
        uniqueDesignationNames.add(item.Department_Name);
        return true;
      });
  
      console.log("language:", language);
  
      const responseMessage = this.ApiResponse[language].answer.response;
      const responseaudio = this.ApiResponse[language].answer.audio;
  
      const response = {
        answer: {
          contextCount: 1,
          response: responseMessage,
          Dep: uniqueDesignation,
          options: this.ApiOptions[language] || [],
          audio: responseaudio
        },
      };
      return response;
    }
  
  
    async GetName(headers: any, language, filteredName) {
      const designation = await getConnection()
        .createQueryBuilder()
        .select([
          "designation.Employee_Id",
          "designation.Name",
          "designation.Designation",
          "designation.Department",
          "designation.Department_Name",
          "designation.Mail",
          "designation.Grade",
          "designation.Landline_No"
        ])
        .from(hrdata, "designation")
        .where(
          `(LOWER(designation.language) = LOWER(:language))
          AND (LOWER(designation.Match_name) LIKE LOWER(:filteredName))`,
          {
            language: language,
            filteredName: `%${filteredName}%`,
          }
        )
        .getMany();
  
      const dataseq = designation.map(record => ({
        Name: record.Name,
        Designation: record.Designation,
        Employee_Id: record.Employee_Id,
        Department_Name: record.Department_Name,
        Department: record.Department,
        Grade: record.Grade,
        Mail: record.Mail,
        Landline_No: record.Landline_No
      }));
  
      if (designation.length === 0) {
        const fallbackMessage = this.ApiFallback[language]?.message || "Sorry, No Data found.";
        const fallbackAudio = this.ApiFallback[language]?.audio || "";
        const fallbackOptions = this.ApiOptions[language] || [];
  
        let response = {
          answer: {
            contextCount: 1,
            response: fallbackMessage,
            options: fallbackOptions,
            audio: fallbackAudio,
          },
        };
        return response;
      }
  
      console.log("language:", language);
      console.log("Filtered Name:", filteredName);
  
      const responseMessage = designation.length === 1
        ? this.ApiResponse[language].answer.response
        : this.ApiMultipleResponse[language].answer.response;
  
      const generateAudio = async (text, language) => {
        try {
          const audio = await this.dynamicVoiceAPI(text, language);
          return audio;
        } catch (error) {
          console.error("Error generating audio:", error);
          return "";
        }
      };
  
      const responseAudio = await generateAudio(JSON.stringify(dataseq), language);
      const responseaudio = this.ApiMultipleResponse[language].answer.audio;
  
      return {
        answer: {
          contextCount: 1,
          response: responseMessage,
          data: dataseq,
          options: this.ApiOptions[language] || [],
          audio: designation.length === 1 ? responseAudio["Uploaded URL"] : responseaudio,
          TextBox: designation.length === 1
        },
      };
    }
  
    async GetCombine(headers: any, language, filteredName, filteredQuery) {
      const replacedQuery = filteredQuery.replace(/mngr|mgr|maneger/gi, 'manager');
      const designation = await getConnection()
        .createQueryBuilder()
        .select([
          "designation.Employee_Id",
          "designation.Name",
          "designation.Designation",
          "designation.Department",
          "designation.Department_Name",
          "designation.Mail",
          "designation.Grade",
          "designation.Landline_No"
        ])
        .from(hrdata, "designation")
        .where(
          `(LOWER(designation.language) = LOWER(:language))
          AND (LOWER(designation.Match_name) LIKE LOWER(:filteredName))
          AND (LOWER(designation.Match_Designation) LIKE LOWER(:filteredQuery))`,
          {
            language: language,
            filteredName: `%${filteredName}%`,
            filteredQuery: `${replacedQuery}`,
          }
        )
        .getMany();
      const dataseq = designation.map(record => ({
        Name: record.Name,
        Designation: record.Designation,
        Employee_Id: record.Employee_Id,
        Department_Name: record.Department_Name,
        Department: record.Department,
        Grade: record.Grade,
        Mail: record.Mail,
        Landline_No: record.Landline_No
      }));
      if (designation.length === 0) {
        const fallbackMessage = this.ApiFallback[language]?.message;
        const fallbackAudio = this.ApiFallback[language]?.audio;
        const fallbackOptions = this.ApiOptions[language];
  
        let response = {
          answer: {
            contextCount: 1,
            response: fallbackMessage,
            options: fallbackOptions,
            audio: fallbackAudio,
          },
        };
        return response;
      }
  
      // console.log("filteredName:", filteredName);
      // console.log("language:", language);
      // console.log("DesignationName:", replacedQuery);
      // console.log("Designation:", designation);
  
      const responseMessage = designation.length === 1
        ? this.ApiResponse[language].answer.response
        : this.ApiMultipleResponse[language].answer.response;
  
      const generateAudio = async (text, language) => {
        try {
          const audio = await this.dynamicVoiceAPI(text, language);
          return audio;
        } catch (error) {
          console.error("Error generating audio:", error);
          return "";
        }
      };
  
      const responseAudio = await generateAudio(JSON.stringify(dataseq), language);
      const responseaudio = this.ApiMultipleResponse[language].answer.audio;
  
      return {
        answer: {
          contextCount: 1,
          response: responseMessage,
          data: dataseq,
          options: this.ApiOptions[language] || [],
          audio: designation.length === 1 ? responseAudio["Uploaded URL"] : responseaudio,
          TextBox: designation.length === 1
        },
      };
    }
  
    async GetEmp_data(headers: any, language, filteredName, filteredDesignation, filteredEmpId) {
      const designation = await getConnection()
        .createQueryBuilder()
        .select([
          "designation.Name",
          "designation.Designation",
          "designation.Employee_Id",
          "designation.Department_Name",
          "designation.Department",
          "designation.Grade",
          "designation.Mail",
          "designation.Department",
          "designation.Landline_No"
        ])
        .from(hrdata, "designation")
        .where(
          `(LOWER(designation.language) = LOWER(:language))
          AND (LOWER(designation.Match_name) LIKE LOWER(:filteredName))
          AND (LOWER(designation.Match_Designation) LIKE LOWER(:filteredQuery))
          AND (LOWER(designation.Employee_Id) LIKE LOWER(:filteredEmpId))`,
          {
            language: language,
            filteredName: `%${filteredName}%`,
            filteredQuery: `${filteredDesignation}`,
            filteredEmpId: `${filteredEmpId}`,
          }
        )
        .getMany();
  
      const dataseq = designation.map(record => ({
        Name: record.Name,
        Designation: record.Designation,
        Employee_Id: record.Employee_Id,
        Department_Name: record.Department_Name,
        Department: record.Department,
        Grade: record.Grade,
        Mail: record.Mail,
        Landline_No: record.Landline_No
      }));
  
      if (designation.length === 0) {
        const fallbackMessage = this.ApiFallback[language]?.message || "Sorry, No Data found.";
        const fallbackAudio = this.ApiFallback[language]?.audio || "";
        const fallbackOptions = this.ApiOptions[language] || [];
  
        let response = {
          answer: {
            contextCount: 1,
            response: fallbackMessage,
            options: fallbackOptions,
            audio: fallbackAudio,
          },
        };
        return response;
      }
  
      const responseMessage = designation.length === 1
        ? this.ApiResponse[language].answer.response
        : this.ApiMultipleResponse[language].answer.response;
  
      const generateAudio = async (text, language) => {
        try {
          const audio = await this.dynamicVoiceAPI(text, language);
          return audio;
        } catch (error) {
          console.error("Error generating audio:", error);
          return "";
        }
      };
  
      const responseAudio = await generateAudio(JSON.stringify(dataseq), language);
      let newOption = {
        "label": "Employee Details",
        "value": "=hrlocator.selection"
      };
      if (language === "hi") {
        newOption = {
          "label": "कर्मचारी विवरण",
          "value": "=hrlocator.selection"
        };
      }
      const options = [newOption, ...(this.ApiOptions[language] || [])];
      return {
        answer: {
          contextCount: 1,
          response: responseMessage,
          data: dataseq,
          options: options,
          audio: responseAudio["Uploaded URL"],
          TextBox: designation.length === 1
        },
      };
    }
    async GetDepartmentAndCity(headers: any, language, filteredDepartment, filteredCity) {
      const designation = await getConnection()
        .createQueryBuilder()
        .select([
          "designation.Employee_Id",
          "designation.Name",
          "designation.Designation",
          "designation.Department",
          "designation.Department_Name",
          "designation.Mail",
          "designation.Grade",
          "designation.Landline_No"
        ])
        .from(hrdata, "designation")
        .where(
          `(LOWER(designation.language) = LOWER(:language))
          AND (LOWER(designation.Match_City) LIKE LOWER(:filteredCity))
          AND (LOWER(designation.Match_Department_name) LIKE LOWER(:filteredDepartment))`,
          {
            language: language,
            filteredCity: `%${filteredCity}%`,
            filteredDepartment: `${filteredDepartment}`,
          }
        )
        .getMany();
      if (designation.length === 0) {
        const fallbackMessage = this.ApiFallback[language]?.message || "Sorry, No Data found.";
        const fallbackAudio = this.ApiFallback[language]?.audio || "";
        const fallbackOptions = this.ApiOptions[language] || [];
  
        let response = {
          answer: {
            contextCount: 1,
            response: fallbackMessage,
            options: fallbackOptions,
            audio: fallbackAudio,
          },
        };
        return response;
      }
  
      console.log("language:", language);
      console.log("DepartmentName:", filteredDepartment);
  
      const responseMessage = designation.length === 1
        ? this.ApiResponse[language].answer.response
        : this.ApiMultipleResponse[language].answer.response;
  
      const responseaudio = designation.length === 1
        ? this.ApiResponse[language].answer.audio
        : this.ApiMultipleResponse[language].answer.audio;
  
      return {
        answer: {
          contextCount: 1,
          response: responseMessage,
          data: designation,
          options: this.ApiOptions[language] || [],
          audio: responseaudio,
          TextBox: designation.length === 1
        },
      };
    }
  
    async GetDesignationDepartmentAndCity(headers: any, language, filteredDesignation, filteredDepartment, filteredCity) {
      const replacedQuery = filteredDesignation.replace(/mngr|mgr|maneger/gi, 'manager');
      const queryBuilder = getConnection()
        .createQueryBuilder()
        .select([
          "designation.Employee_Id",
          "designation.Name",
          "designation.Designation",
          "designation.Department",
          "designation.Department_Name",
          "designation.Mail",
          "designation.Grade",
          "designation.Landline_No"
        ])
        .from(hrdata, "designation")
        .where(
          `(LOWER(designation.language) = LOWER(:language))
          AND (LOWER(designation.Match_Designation) LIKE LOWER(:filteredDesignation))
          AND (LOWER(designation.Match_City) LIKE LOWER(:filteredcity))
          AND (designation.Match_Department_name IS NULL OR LOWER(designation.Match_Department_name) LIKE LOWER(:filteredDepartment))`, // Updated condition to handle NULL department
          {
            language: language,
            filteredDesignation: `${replacedQuery}`,
            filteredDepartment: `%${filteredDepartment}%`,
            filteredcity: `%${filteredCity}%`,
          }
        );
  
      const designation = await queryBuilder.getMany();
      if (designation.length === 0) {
        const fallbackMessage = this.ApiFallback[language]?.message || "Sorry, No Data found.";
        const fallbackAudio = this.ApiFallback[language]?.audio || "";
        const fallbackOptions = this.ApiOptions[language] || [];
  
        return {
          answer: {
            contextCount: 1,
            response: fallbackMessage,
            options: fallbackOptions,
            audio: fallbackAudio,
          },
        };
      }
  
      const responseMessage = designation.length === 1
        ? this.ApiResponse[language].answer.response
        : this.ApiMultipleResponse[language].answer.response;
  
      const responseaudio = designation.length === 1
        ? this.ApiResponse[language].answer.audio
        : this.ApiMultipleResponse[language].answer.audio;
  
      return {
        answer: {
          contextCount: 1,
          response: responseMessage,
          data: designation,
          options: this.ApiOptions[language] || [],
          audio: responseaudio,
          TextBox: designation.length === 1
        },
      };
    }
  
    async GetDATA(headers: any, language, filteredName, filteredQuery) {
      const designation = await getConnection()
        .createQueryBuilder()
        .select([
          "designation.Employee_Id",
          "designation.Name",
          "designation.Designation",
          "designation.Department",
          "designation.Department_Name",
          "designation.Mail",
          "designation.Grade",
          "designation.Landline_No"
        ])
        .from(hrdata, "designation")
        .where(
          `(LOWER(designation.language) = LOWER(:language))
          AND (LOWER(designation.Match_name) LIKE LOWER(:filteredName))
          AND (LOWER(designation.Match_Department_name) LIKE LOWER(:filteredQuery))`,
          {
            language: language,
            filteredName: `%${filteredName}%`,
            filteredQuery: `${filteredQuery}`,
          }
        )
        .getMany();
      if (designation.length === 0) {
        const fallbackMessage = this.ApiFallback[language]?.message || "Sorry, No Data found.";
        const fallbackAudio = this.ApiFallback[language]?.audio || "";
        const fallbackOptions = this.ApiOptions[language] || [];
  
        let response = {
          answer: {
            contextCount: 1,
            response: fallbackMessage,
            options: fallbackOptions,
            audio: fallbackAudio,
          },
        };
        return response;
      }
  
      console.log("language:", language);
      console.log("DepartmentName:", filteredQuery);
  
      const responseMessage = designation.length === 1
        ? this.ApiResponse[language].answer.response
        : this.ApiMultipleResponse[language].answer.response;
  
      const responseaudio = designation.length === 1
        ? this.ApiResponse[language].answer.audio
        : this.ApiMultipleResponse[language].answer.audio;
  
      return {
        answer: {
          contextCount: 1,
          response: responseMessage,
          data: designation,
          options: this.ApiOptions[language] || [],
          audio: responseaudio,
          TextBox: designation.length === 1
        },
      };
  
    }
    async GetGrade(headers: any, language, filteredGrade, filteredDepartment) {
      const designation = await getConnection()
        .createQueryBuilder()
        .select([
          "designation.Employee_Id",
          "designation.Name",
          "designation.Designation",
          "designation.Department",
          "designation.Department_Name",
          "designation.Mail",
          "designation.Grade",
          "designation.Landline_No"
        ])
        .from(hrdata, "designation")
        .where(
          `(LOWER(designation.language) = LOWER(:language))
          AND (LOWER(designation.Grade) LIKE LOWER(:filteredGrade))
          AND (LOWER(designation.Match_Department_name) LIKE LOWER(:filteredDepartment))`,
          {
            language: language,
            filteredGrade: `%${filteredGrade}%`,
            filteredDepartment: `${filteredDepartment}`,
          }
        )
        .getMany();
      if (designation.length === 0) {
        const fallbackMessage = this.ApiFallback[language]?.message || "Sorry, No Data found.";
        const fallbackAudio = this.ApiFallback[language]?.audio || "";
        const fallbackOptions = this.ApiOptions[language] || [];
  
        let response = {
          answer: {
            contextCount: 1,
            response: fallbackMessage,
            options: fallbackOptions,
            audio: fallbackAudio,
          },
        };
        return response;
      }
  
      console.log("language:", language);
      console.log("DepartmentName:", filteredDepartment);
      console.log("GRADEName:", filteredGrade);
  
      const responseMessage = designation.length === 1
        ? this.ApiResponse[language].answer.response
        : this.ApiMultipleResponse[language].answer.response;
  
      const responseaudio = designation.length === 1
        ? this.ApiResponse[language].answer.audio
        : this.ApiMultipleResponse[language].answer.audio;
  
      return {
        answer: {
          contextCount: 1,
          response: responseMessage,
          data: designation,
          options: this.ApiOptions[language] || [],
          audio: responseaudio,
          TextBox: designation.length === 1
        },
      };
    }
  
    async GetDEsig_Grade(headers: any, language, filteredGrade, filteredDesignation) {
      const replacedQuery = filteredDesignation.replace(/mngr|mgr|maneger/gi, 'manager');
      const designation = await getConnection()
        .createQueryBuilder()
        .select([
          "designation.Employee_Id",
          "designation.Name",
          "designation.Designation",
          "designation.Department",
          "designation.Department_Name",
          "designation.Mail",
          "designation.Grade",
          "designation.Landline_No"
        ])
        .from(hrdata, "designation")
        .where(
          `(LOWER(designation.language) = LOWER(:language))
          AND (LOWER(designation.Grade) LIKE LOWER(:filteredGrade))
          AND (LOWER(designation.Match_Designation) LIKE LOWER(:filteredDesignation))`,
          {
            language: language,
            filteredGrade: `%${filteredGrade}%`,
            filteredDesignation: `${replacedQuery}`,
          }
        )
        .getMany();
      console.log("DesignationName:", filteredDesignation);
      console.log("GRADEName:", filteredGrade);
      if (designation.length === 0) {
        const fallbackMessage = this.ApiFallback[language]?.message || "Sorry, No Data found.";
        const fallbackAudio = this.ApiFallback[language]?.audio || "";
        const fallbackOptions = this.ApiOptions[language] || [];
  
        let response = {
          answer: {
            contextCount: 1,
            response: fallbackMessage,
            options: fallbackOptions,
            audio: fallbackAudio,
          },
        };
        return response;
      }
  
      console.log("language:", language);
      console.log("DesignationName:", filteredDesignation);
      console.log("GRADEName:", filteredGrade);
  
      const responseMessage = designation.length === 1
        ? this.ApiResponse[language].answer.response
        : this.ApiMultipleResponse[language].answer.response;
  
      const responseaudio = designation.length === 1
        ? this.ApiResponse[language].answer.audio
        : this.ApiMultipleResponse[language].answer.audio;
  
      return {
        answer: {
          contextCount: 1,
          response: responseMessage,
          data: designation,
          options: this.ApiOptions[language] || [],
          audio: responseaudio,
          TextBox: designation.length === 1
        },
      };
    }
  
    async GetDepartment_code(headers: any, language, filteredDepartment, filteredDesignation) {
      const replacedQuery = filteredDesignation.replace(/mngr|mgr|maneger/gi, 'manager');
      const designation = await getConnection()
        .createQueryBuilder()
        .select([
          "designation.Employee_Id",
          "designation.Name",
          "designation.Designation",
          "designation.Department",
          "designation.Department_Name",
          "designation.Mail",
          "designation.Grade",
          "designation.Landline_No"
        ])
        .from(hrdata, "designation")
        .where(
          `(LOWER(designation.language) = LOWER(:language))
           AND (LOWER(designation.Match_Designation) LIKE LOWER(:filteredDesignation))
          AND (LOWER(designation.Department) LIKE LOWER(:filteredDepartment))`,
          {
            language: language,
            filteredDepartment: filteredDepartment === null ? '%' : `%${filteredDepartment}%`,
            filteredDesignation: `${replacedQuery}`,
          }
        )
        .getMany();
      if (designation.length === 0) {
        const fallbackMessage = this.ApiFallback[language]?.message || "Sorry, No Data found.";
        const fallbackAudio = this.ApiFallback[language]?.audio || "";
        const fallbackOptions = this.ApiOptions[language] || [];
  
        let response = {
          answer: {
            contextCount: 1,
            response: fallbackMessage,
            options: fallbackOptions,
            audio: fallbackAudio,
          },
        };
        return response;
      }
  
      console.log("Department_code:", filteredDepartment);
      console.log("language:", language);
      console.log("Designation_Match:", replacedQuery);
  
      const responseMessage = designation.length === 1
        ? this.ApiResponse[language].answer.response
        : this.ApiMultipleResponse[language].answer.response;
  
      const responseaudio = designation.length === 1
        ? this.ApiResponse[language].answer.audio
        : this.ApiMultipleResponse[language].answer.audio;
  
      return {
        answer: {
          contextCount: 1,
          response: responseMessage,
          data: designation,
          options: this.ApiOptions[language] || [],
          audio: responseaudio,
          TextBox: designation.length === 1
        },
      };
    }
  
    async GetCode(headers: any, language, filteredDepartment) {
      const designation = await getConnection()
        .createQueryBuilder()
        .select([
          "designation.Employee_Id",
          "designation.Name",
          "designation.Designation",
          "designation.Department",
          "designation.Department_Name",
          "designation.Mail",
          "designation.Grade",
          "designation.Landline_No"
        ])
        .from(hrdata, "designation")
        .where(
          `(LOWER(designation.language) = LOWER(:language))
          AND (LOWER(designation.Department) LIKE LOWER(:filteredDepartment))`,
          {
            language: language,
            filteredDepartment: `%${filteredDepartment}%`,
          }
        )
        .getMany();
      if (designation.length === 0) {
        const fallbackMessage = this.ApiFallback[language]?.message || "Sorry, No Data found.";
        const fallbackAudio = this.ApiFallback[language]?.audio || "";
        const fallbackOptions = this.ApiOptions[language] || [];
  
        let response = {
          answer: {
            contextCount: 1,
            response: fallbackMessage,
            options: fallbackOptions,
            audio: fallbackAudio,
          },
        };
        return response;
      }
  
      console.log("Department_code:", filteredDepartment);
      console.log("language:", language);
      const responseMessage = designation.length === 1
        ? this.ApiResponse[language].answer.response
        : this.ApiMultipleResponse[language].answer.response;
  
      const responseaudio = designation.length === 1
        ? this.ApiResponse[language].answer.audio
        : this.ApiMultipleResponse[language].answer.audio;
  
      return {
        answer: {
          contextCount: 1,
          response: responseMessage,
          data: designation,
          options: this.ApiOptions[language] || [],
          audio: responseaudio,
          TextBox: designation.length === 1
        },
      };
    }
  
    async GetDepartment(headers: any, language, filteredDepartment, filteredQuery) {
      const replacedQuery = filteredQuery.replace(/mngr|mgr|maneger/gi, 'manager');
      const designation = await getConnection()
        .createQueryBuilder()
        .select([
          "designation.Employee_Id",
          "designation.Name",
          "designation.Designation",
          "designation.Department",
          "designation.Department_Name",
          "designation.Mail",
          "designation.Grade",
          "designation.Landline_No"
        ])
        .from(hrdata, "designation")
        .where(
          `(LOWER(designation.language) = LOWER(:language))
          AND (LOWER(designation.Match_Department_name) LIKE LOWER(:filteredDepartment))
          AND (LOWER(designation.Match_Designation) LIKE LOWER(:filteredQuery))`,
          {
            language: language,
            filteredDepartment: `%${filteredDepartment}%`,
            filteredQuery: `${replacedQuery}`,
          }
        )
        .getMany();
      console.log("Department_Match:", filteredDepartment);
      console.log("language:", language);
      console.log("Designation_Match:", replacedQuery);
  
      if (designation.length === 0) {
        const fallbackMessage = this.ApiFallback[language]?.message || "Sorry, No Data found.";
        const fallbackAudio = this.ApiFallback[language]?.audio || "";
        const fallbackOptions = this.ApiOptions[language] || [];
  
        let response = {
          answer: {
            contextCount: 1,
            response: fallbackMessage,
            options: fallbackOptions,
            audio: fallbackAudio,
          },
        };
        return response;
      }
  
      const responseMessage = designation.length === 1
        ? this.ApiResponse[language].answer.response
        : this.ApiMultipleResponse[language].answer.response;
  
      const responseaudio = designation.length === 1
        ? this.ApiResponse[language].answer.audio
        : this.ApiMultipleResponse[language].answer.audio;
  
      return {
        answer: {
          contextCount: 1,
          response: responseMessage,
          data: designation,
          options: this.ApiOptions[language] || [],
          audio: responseaudio,
          TextBox: designation.length === 1
        },
      };
    }
  
    async PerimiumDueCheck(userInput) {
      let axiosConfig = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      var payload = {
        policyNo: userInput.policyNo,
  
        birthDate: userInput.dob,
      };
      await axios
        .post(userInput.host, payload, axiosConfig)
        .then(async (res) => {
          this.apiResponse = res.data;
          // console.log(res);
        })
        .catch((err) => {
          // console.log("AXIOS ERROR: ", err);
          this.apiResponse = err;
        });
      // console.log(this.apiResponse);
      return this.apiResponse;
    }
    async UserRetentionReport(headers) {
      var start = new Date().toISOString();
      console.log("start && end date", start);
      const user = session.query(
        `SELECT   
        leadsession."id",
        leadsession."userToken",
        "name" AS name,
        leadsession."token_gen_time" AS LastLoginTime,
        floor((EXTRACT(EPOCH FROM leadsession.token_exp::timestamp) - EXTRACT(EPOCH FROM '${start}'::timestamp))/3600) As Difference
        FROM nlp."session" as leadsession  join nlp.leads on nlp.leads."userToken"=leadsession."userToken" where nlp.leads."appId"='${headers.appId}' and leadsession.token_exp > '${start}' `
      );
      return user;
    }
    async SessionHistory(headers) {
      var thisHour = new Date().toISOString();
      var yesterday = new Date(
        new Date().setDate(new Date().getDate() - 1)
      ).toISOString();
      var date = new Date();
      date.setHours(date.getHours() - 1);
      var lastHour = date.toISOString();
      let d = new Date();
      let sevenDaysFromNow = d.setDate(d.getDate() - 7);
      var sevenDays = new Date(sevenDaysFromNow).toISOString();
      console.log("start && end date", thisHour, lastHour, yesterday, sevenDays);
      const LastOneHourCount = await session.query(
        `SELECT count(*) as count FROM nlp."session" where  token_gen_time BETWEEN '${lastHour}' AND '${thisHour}';`
      );
      const LastoneDayCount = await session.query(
        `SELECT count(*) as count FROM nlp."session" where token_gen_time  BETWEEN '${yesterday}' AND '${thisHour}';`
      );
      const LastoneWeekCount = await session.query(
        `SELECT
        count(*) as count
        FROM nlp."session" where token_gen_time BETWEEN '${sevenDays}' AND '${thisHour}' `
      );
      var result = {
        LastOneHourCount: LastOneHourCount[0].count,
        LastoneDayCount: LastoneDayCount[0].count,
        LastoneWeekCount: LastoneWeekCount[0].count,
      };
      return result;
    }
    async getBharatGPT(query) {
      let payload = {
        prompt: query,
      };
      return await axios
        .post("http://34.93.162.189:9003/bharatgpt/getResponse", payload)
        .then(async (res) => {
          return res.data;
        });
    }
    async dynamicVoiceAPI(text, language) {
      let result;
      if (text.includes('-') || text.includes('_')) {
        text = text.replace(/[-_]/g, ' ');
      }
      const replacements = {
        '0': 'zero',
        'Shri.': 'Shri',
        'Ms.': 'Miss',
        'Id': 'ID',
        '"Name":': '',
        '"Designation":': '',
        'Mail': 'Email',
        '"Department":': '',
        'Landline No': 'Landline Number',
      };
      const pattern = new RegExp(Object.keys(replacements).join('|'), 'g');
      text = text.replace(pattern, (match) => replacements[match]);
      text = text.replace(/\d+/g, (match) => match.split("").join(" "));
  
      let payload = { sourceText: text, sourceLanguage: language };
  
      // console.log("---->", payload);
      let axiosConfig = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Connection: "keep-alive",
          "auth-Key": "2b5fb5d4-0753-4302-b661-f8580e9effb0",
          "sec-ch-ua-mobile": "?0",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
          "Cache-Control": "max-age=31536000",
          "app-id": "29fd4f94-f793-4227-9588-056b5ffb1318",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          Referer: "https://assistant.corover.mobi/irctc/chatbot.html",
          "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
        },
      };
      await axios
        .post(
          "https://licdev.corover.ai/nlpAPI/convertRealTimeAudio",
          payload,
          axiosConfig
        )
        .then(async (res) => {
          // console.log("voice ==>", res);
          result = res;
        })
        .catch((err) => {
          console.log(err);
          // res.status(500).send(err);
        });
      if (result.data) {
        // console.log("voice =>", result.data);
        return result.data;
      } else {
        return null;
      }
    }
  }
  