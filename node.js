const MiniSearch = require("minisearch");

const data = [
  "AVADHUT CHAVAN",
  "HEMANT SAINI",
  "NAVEEN KUMAR",
  "AJAYA KUMAR SETHI",
  "ARPIT ANAND",
  "RITESH CHHAPARIA",
  "YOGESH CHANDER",
  "GEO ZAJO",
  "SUNIL MURMU",
  "UNNAT RAJORA",
  "SACHIN XALXO",
  "MOHAMMAD AHMED",
  "GURPREET SINGH",
  "MAYANK CHOUDHARY",
  "RISHAV DROLIA",
  "MUDIT MITTAL",
  "SHARATH ELLAGONDA",
  "MANINDER CHEEMA",
  "MADHUSUDHANAN",
  "APARNA THYAGARAJAN",
  "CHANDRAKANTA MITRA",
  "SANJAY SINGH BHATI",
  "VIKASH NARNOLI",
  "MANISH JHA",
  "TREASA KURIALA",
  "RAJESH GUJJAR",
  "Chitra",
  "SMITA D MELLO",
  "SHRADDHA JOSHI",
  "Deepak Kumar",
  "Kunwar Singh",
  "Sachin Jadhav",
  "PADMA BHARATHI",
  "KOMAL BAIS",
  "PRAGYA SINGH",
  "SANJUKTA MAHALA",
  "SATHYA KUMARAN K S",
  "VINEET BIYANI",
  "ANKUR BISHNOI",
  "ABHISHEK ROZATKAR",
  "BHUMIKA KANOJIA",
  "PAWANDEEP",
  "ABHISHEK RANJAN",
  "AMRUTA NAIK",
  "SRAVAN KUMAR TELLA",
  "ISHITA SHARMA",
  "AJINKYA KAMBLE",
  "SONAL PEDNEKAR",
  "ASHISH SINGH SOLANKEY",
  "ADESH SINGHAL",
  "ISHAN PENDAM",
  "POONAM",
  "SHIVANI GUPTA",
  "KARTIKI TULASKAR",
  "PRATEEK SHRIVASTAVA",
  "RUSHALI MOHASE",
  "MEGHA PARMAR",
  "ABHAY BADAYA",
  "ANMOLA AGRAWAL",
  "CHETAN CHORARIA",
  "KARTHIK",
  "KUNAL LUNAWAT",
  "ROSHAN MEENA",
  "SUVARNA AGARWAL",
  "VANDANA CHOUDHARY",
  "YASHWANTH MANTHANI",
  "SAILESHKUMAR SHARMA",
  "ANURAG BOLIA",
  "Kelavath Naik",
  "RAJESH DANGETI",
  "DEEP SHAH",
  "ATUL Agarwal",
  "JITENDRA KUMAR",
  "VENKATESHWARLU TUTTURU",
  "RANJAN KUMAR SAHOO",
  "VANDANA JOGLEKAR",
  "RAJ DAS",
  "VIMAL BHATTER",
  "ACHAL SINGH",
  "DIPANJAN MITRA",
  "SURABHI GUPTA",
  "YOGITA JADHAV",
  "E BALASUBRAMANIAN",
  "NIRMAL MEHROTRA",
  "TOSIT AGARWAL",
  "RAJENDRAN",
  "Apar Patiyat",
  "Adwait Dahale",
  "Ishan Sood",
  "Abhijeet Srivastava",
  "Haque",
  "Rohan Israni",
  "Afzal",
  "DHRUBA DAS",
  "MEENAKSHI RAMAKRISHNAN",
  "PRAGATI BANDEKAR",
  "RAJEEV KUMAR",
  "RAMAKRISHNA DUDI",
  "DHARMENDRA JAIN",
  "ABHISHEK JAIN",
  "AEKTA GUPTA",
  "ANIKET KUMAR",
  "KRISHNA",
  "RAHUL DANGE",
  "SUMIT SARRAF",
  "SANCHIT GOYAL",
  "VEENA LAKWALE",
  "MOHAMMAD SHAHID",
  "VANDANA AGARWAL",
  "NISHANT SINGHANIA",
  "SANJAY PAREEK",
  "SAKETH PALLAPOLU",
  "MUKUND SABOO",
  "MANAY SHAH",
  "SANJAY PURAO",
  "SIVARAM KRISHNAN",
  "DEEPESH M U",
  "SHINOD",
  "SAREENA",
  "PARMANAND SHARMA",
  "PRACHI NADKAR",
  "SUSANTA DAS",
  "GARIMA MAHESHWARI",
  "Rajeshri Palwankar",
  "SHWETHA RAI",
  "KOMAL SUNDARESAN",
  "MOHIT",
  "GEETA V MENON",
  "SUNITA CHAVAN",
  "SANTOSH SHARMA",
  "PRAMILA SRIDHAR",
  "CHAITALI KARATE",
  "DIVYA HAMIRBASIA",
  "RAJUDEEN",
  "PAWAN KUMAR CHOWDHARY",
  "RINKI GOSWAMI",
  "KIRAN DHEMBRE",
  "TRIVIKRAM NAYAK",
  "VIKRAM JOSHI",
  "ABHIGNAN DANDE",
  "BARUN GURANI",
  "JYOTI DOLEY",
  "MOHIT AGARWAL",
  "PRANAY SINGH",
  "PRIYANKA MEENA",
  "NIKHIL MITTAL",
  "Krashna",
  "GAURAV GUPTA",
  "HARINI BALAJI",
  "MUKUL SHUKLA",
  "RITESHKUMAR NANDWANI",
  "RACHNA ANAND",
  "PRADEEP RAMAKRISHNAN",
  "Deena Sarangadharan",
  "Manoj Reddy",
  "Rohan Shukla",
  "Nikhil Chaudhary",
  "Manoj Arora",
  "Neeraj Meena",
  "CHRISTINA BASIL",
  "JULIE LOBO",
  "DAISY NARKAR",
  "PRABHAS RATH",
  "MEENA GUPTA",
  "SHYNI SUNIL",
  "TATHAGATA BISWAS",
  "PRASAD PATANKAR",
  "VIMAL VERMA",
  "RAVI KUMAR",
  "VIPUL KHANDELWAL",
  "KALYANI",
  "ASHISH MALLIK",
  "PAMPANA AKSHAY",
  "SANGEETA MALHOTRA",
  "SANJAY ARUK",
  "SUBHAM AGGARWAL",
  "HIMANSHI GUPTA",
  "Anuradha Yadav",
  "DEEPALI DIXIT",
  "LALTU PORE",
  "VINOD KUMARI",
  "DEEPTHI",
  "PRANALI PATIL",
  "SUDHAKAR KHAIRNAR",
  "SUVIDHA NAGPAL",
  "SNEHA NAUTIYAL",
  "POULAMI CHOUDHURY",
  "SUMIT KUMAR VERMA",
  "VIVEK KUMAR",
  "VENKATESWARAN RAMAKRISHNAN",
  "LORETTA DIAS",
  "AGNES JOSEPH",
  "SHAILESH KHATAVKAR",
  "BALBIR SINGH",
  "DEEPTI PANDEY",
  "JAYEETA RAY",
  "VINOD PARDESHI",
  "DHANESH DHOLAKIA",
  "PREETHI UDAYASHANKAR",
  "HARSHAL PUND",
  "BRITI MANDAL",
  "RAMAN MORWAL",
  "NOORIN KHAN",
  "GAURAV DWIVEDI",
  "VIJAY CHOUDHARY",
  "ALOK SINGH",
  "ANJALI DILEEP",
  "GAURAV NAMDEV",
  "HARSH KANKANE",
  "POOJA RAI",
  "PUSHPRAJ SAINDHAV",
  "SOMASHISH",
  "SUMAN MEENA",
  "UTKARSH RATHORE",
  "DHAVAL SHARMA",
  "RAMNISH KUMAR",
  "RISHI JAIN",
  "RISHABH GARG",
  "Yash Kalbalia",
  "BARNALI MUKHERJEE",
  "BIJU",
  "SHASHIKUMAR VALSAKUMAR",
  "RAMAR",
  "ARVIND KUMAR",
  "SOMA MAJUMDER",
  "AMAR NAVLANI",
  "AMIT KAPOOR",
  "VIJAYANT VERMA",
  "KEDAR BASAVRAJ HIREMATH",
  "Kandunuri Lenin",
  "Anshuman Sharma",
  "KHURSHID FATAKIA",
  "ANTHIA ALOYSIUS",
  "SANGEETA D MELLO",
  "VANESSA QUADRI",
  "VANESSA BARRETO",
  "SHANMUKHA PRADEEP KOLAKALURI",
  "JAYANTA JASH",
  "DHAKSHINAMURTHY",
  "HELEN D SA",
  "WINIFRED NORONHA",
  "VIDYADHARR KALYAANKAR",
  "REKHA VERMA",
  "MARIO SEQUEIRA",
  "SAREETA BHADANGE",
  "JAKKULA SRINIVAS",
  "SIVAPRAKASAM BALASUBRAMANIAN",
  "PREETI PATEL",
  "TENZIN TSERING",
  "PIYUSHKUMAR MAHAJAN",
  "ZUBIN",
  "ANWESA PAUL",
  "KUMARI SHALLY",
  "RAM MURARI",
  "BINOD SHARMA",
  "BHAGWANDAS SAMARIYA",
  "RAJESWARI RATH",
  "MEDHA SONPAROTE",
  "JULIET FONSECA",
  "NITIN MANILAL HARIA",
  "Kartan Shivaraj",
  "KRISHNA KANHAIYA",
  "SHAYRI MENEZES",
  "SANDEEP DEORE",
  "BHAVANA RAVI KUMAR",
  "ANAMIKA SHRIPAT",
  "ANKON RAY",
  "DIVYA THEJA",
  "SWAPNIL JAIN",
  "YAJNASENI ROY",
  "VIVEKANANDA SWAROOP S",
  "LAKSHMANAN",
  "GOVIND SHARMA",
  "MANNAT ARORA",
  "PRASHANT GOSWAMI",
  "RAKSHIT",
  "SHIVAM",
  "SWATI YADAV",
  "VARUN YADAV",
  "YASH TELGOTE",
  "DHARMESH GEHLOT",
  "NISHITH KUMAR",
  "ARUN MAHENDRAN",
  "AVICHAL TOMAR",
  "SHWETA MEENA",
  "VAIBHAV MODI",
  "KRITIKA TONGIA",
  "GEETHA",
  "ANJU MAHENDRA",
  "PARAG KUMAR SINHA",
  "SHARIKA",
  "ASHUTOSH ARUN",
  "KAJIO MAO",
  "SAKKEENA",
  "AMITESH KUMAR",
  "RATAN LAL JAT",
  "CHINTAN SHAH",
  "DIKSHAL KHATRI",
  "Prajwal Raut",
  "Pradnya Pawar",
  "Priyam Mhashilkar",
  "DHRUV CHOPRA",
  "SUKANYA BANERJEE",
  "RAJAN KUMAR",
  "LEENA SHREE",
  "JOYDEEP NASKAR",
  "SUNKU VENUGOPAL",
  "KINJAL GHOSE",
  "JOY AGARWAL",
  "GUNJAN BIRULY",
  "OM PRAKASH SHARMA",
  "SOMRITA NASKAR",
  "AMIT KUMAR",
  "INDRAJIT BAGE",
  "SUDHARANI KINDO",
  "GOVINDAYAPALLI RAM MOHAN RAO",
  "RAJ KUMAR KALURI",
  "MITRAJEET DEY",
  "SANJAY SARWADE",
  "VIKAS",
  "ANIRUDDHA PATIL",
  "Sudhansu Seth",
  "RACHEL VARGHESE",
  "SARANG DIWAKAR RAO SAMBARE",
  "RAJESH HARIYAN",
  "MAHARUKH HOZDAR",
  "RS NANDINI",
  "RAVINDRA PARKAR",
  "SACHIN KEER",
  "UPADHAYAYULA RAMESH",
  "SUMATHI",
  "DEEWAN SAMAD",
  "JAGANNATH DAS",
  "MOHAN LAL SAROJ",
  "PRASANTA KUMAR MISHRA",
  "MOHD SAJID",
  "RAVINDRA SINGH",
  "SARAT BENDI",
  "SANJEEV VERMA",
  "ADITYA KALE",
  "VSN PRATYUSHA TADIKAMALLA",
  "GANESH KOLEKAR",
  "ADWAIT DHAMANKAR",
  "ROHAN DAREKAR",
  "BHUPAL KHIDRAPURE",
  "SHALINI PODDER",
  "NEHA SANTORIA",
  "AJAY SHAW",
  "RAVNEET SINGH CHAWLA",
  "SUMIT KUMAR JHA",
  "POORNIMA S",
  "SHASHANK GUPTA",
  "AVINASH KUMAR SINGH",
  "ANINDYA SUR",
  "BHUVANESWARI S",
  "MADHAV ARORA",
  "PRANJAL BANSAL",
  "PRATHAMESH BOBHATE",
  "AASHISH RANJAN",
  "DEEPAK AGRAWAL",
  "SUMAN KUMAR",
  "DIVAKAR PANDEY",
  "PRADNYA KENDRE",
  "ADIL KHANAPURI",
  "SATHISH",
  "SURYA",
  "SYED BASHA",
  "SHUBHAM PAL",
  "DIWAKAR KUMAR",
  "TANAY SIKARVAR",
  "AVINASH JAISWAL",
  "NAMAN JAIN",
  "PARAG BASU",
  "KUMAR",
  "NAVEEN KHANNA",
  "VIJAYARANGAM",
  "BARATAM KRISHNA RAO",
  "CLIFFORD ALMEIDA",
  "AMOL HOGADE",
  "KISHOR NIKAM",
  "NIRAJ GUPTA",
  "SALMANU KK",
  "VINEETA SINHA",
  "ASHOK KUMAR J",
  "LAKSHMISHA K",
  "GOPINATH HEJIB",
  "SEKHAR",
  "SUMAN SATTAVAN",
  "SAURABH PRAMODKUMAR YADAV",
  "RANGAN BHATTACHARYA",
  "SAGAR ZAPARDE",
  "RAJKAMAL SENDHA",
  "Divyansh Singh",
  "Anukaran Singh",
  "Sreejith",
  "RANJANA CHANDHERE",
  "CATHERINE RAPOSE",
  "WILMA PEREIRA",
  "ANSHUMAN DAS",
  "SATHISH BABU",
  "JAGAN MOHAN RAJU",
  "GEETHA KAMATH",
  "APPALACHARI",
  "ANAND EKKA",
  "NIKKI AGARWAL",
  "SONALI BADOLE",
  "CHANDRA MOHAN PEMMA REDDY",
  "DINESH RAVULAPATI",
  "MONICA KULKARNI",
  "GOVIND GOYAL",
  "PRASHASTI GODARA",
  "ASHA SHETTY",
  "SIDDHESH LOTLIKAR",
  "KRISHNAMOORTHY M",
  "PREETI MAHESHWARI",
  "JENNIFER CARDOZA",
  "MRINAL MAYANK",
  "RAGHU VILASAGARAM",
  "SNEHA JALAN",
  "NISHTHA TEWARI",
  "DEVI SHOBANA G",
  "KRANTI SARDESAI",
  "DEB BHATTACHARJEE",
  "JUBIN MEHTA",
  "LAXMI RAMPURAWALA",
  "SAMUEL MADDELA",
  "VIKAS KOMERA",
  "SUPRIYA KABRA",
  "HARSHAD PATIL",
  "KUNAL SONAWANE",
  "PRINKADEEP SINGH BHATIA",
  "SANTOSH MEENA",
  "SUNIL KHATRI",
  "ABHISHEK KUMAR",
  "GOPIKA JAYAN",
  "HITESH AGGARWAL",
  "VISHNU A",
  "SACHIN G",
  "PRANAY AGRAWAL",
  "LAKSHAY AGARWAL",
  "DIGANT RUPALKAR",
  "RUSHIKESH BHOPATRAO",
  "ABHISHEK ASHISH",
  "ASHISH SAINI",
  "GAUTAM KUMAR",
  "GOURAV SHEKHAWAT",
  "KRITIKA",
  "NIKHIL RAJ",
  "TANYA KATHURIA",
  "TURAB CHIMTHANAWALA",
  "VRAJESH OJHA",
  "ABHISHEK PIPLWA",
  "SIDDHARTHA SARKAR",
  "ANUPMA CHADHA",
  "M Srikanth",
  "PRIYANKA MAHAPATRA",
  "RAJANI AGADI KORI",
  "VISHAKHA MORE",
  "Sarika Kataria",
  "ANAND",
  "CHETANKUMAR FUMAKIYA",
  "LAKSHAYA CHAWLA",
  "PETER MARDI",
  "ROHIT SARAF",
  "CHHAVI KAPOOR",
  "MANASWINI MAHAPATRA",
  "ROHIT DUBEY",
  "ATUL PATIL",
  "Tarun Garg",
  "Bimal Panda",
  "DEVANG TRIVEDI",
  "MANOJ KUMAR",
  "TANDAVA CHANDALURI",
  "MEENAKSHI JAYANT",
  "ATUL MITTAL",
  "VIKRAM SAIBA",
  "NAVEEN GUPTA",
  "MILIND GAJARE",
  "NEERAJ MODI",
  "DEBDUTI BISWAS",
  "BHARAT SACHDEVA",
  "SUBHASHNI SHARMA",
  "ARUN PANIGRAHI",
  "PASUMARTHI BABU",
  "RAHUL SORATE",
  "ROHIT RAJ",
  "SADASHIV DESHMUKH",
  "Suchit Gala",
  "SUMIT POWAR",
  "JAVED ZAMAN",
  "ABHIJIT CHANDRAKANT KEKANE",
  "RAJNISH KEDAR PRASAD",
  "KAUSHAL KHANDELWAL",
  "RAUNAK LAKRA",
  "SHASHANK PANWAR",
  "AAKASH KAMLASKAR",
  "SHUBHAM JAIN",
  "ANUPAMA YADAV",
  "BEDUDURU RAO",
  "KIRUBAKARAN",
  "NIDHI",
  "RASHID",
  "SONALI YADAV",
  "YAGNAM LOKESH",
  "ZULFIQAR ALI",
  "GOGULA REDDY",
  "SRINIDHI ADHIKARY",
  "ALIASGAR MITHWANI",
  "ANINDYA DAS",
  "N SUNIL",
  "NITIN SINGH",
  "SABIR SAWANT",
  "PRABHAKAR",
  "SIVA GOVINDO PATRA",
  "ANAND KUMAR SINGH",
  "NITESH BHATI",
  "VIJAYAN",
  "RINKAL SANGHAVI",
  "ANSHUL GOYAL",
  "SUDEEP MISHRA",
  "VERSHA AGARWAL",
  "MANISHA CHANDRASHEKHAR JANA",
  "GK JAIGANESH",
  "DIPAK DAHYABHAI PATEL",
  "Deepika",
  "DV Krishna",
  "Sai Kothanooru",
  "Abhinav Ingole",
  "Aman Kumar",
  "PRASHANT CHOUDHARY",
  "PAWAN DHAKARE",
  "SOPHIE MEACHERY",
  "ARCANGEL GUPTA",
  "PRITAM BARI",
  "SURENDRA GANGAVARAPU",
  "ABHISHEK AGARWAL",
  "YUVRAJ GROVER",
  "KAMBALA ANANDA RAO",
  "SATISH SHINDE",
  "ANIRBAN PANI",
  "MOHIT GUPTA",
  "MAMATA ROY",
  "HIMANSHU CHAUDHARY",
  "RAVICHANDRA PALVAI",
  "RAJVEER SINGH YADAV",
  "AYUSH SINGH",
  "K KUMAR",
  "PIYUSH KANDA",
  "PRAIRIT VERMA",
  "RITESH PANDEY",
  "SIDDHARTHA RATMELE",
  "VARUN KUMAR",
  "VINAY YADAV",
  "SUMIT GUPTA",
  "ADITI AGARWAL",
  "AJEET KUMAR",
  "VINAYAGA SUNDARAM",
  "APOORVA RATHORE",
  "PRAGATI SINGH",
  "AKSHAY NAIKWADI",
  "JAYASHRI D",
  "SANDEEP KUMAR",
  "ABHIJITH",
  "ABHISHEK YADAV",
  "ADARSH TRIVEDI",
  "ASHWINI JAIN",
  "BHARGAVI KADULURI",
  "HARJAS KALSI",
  "MRIDUL TYAGI",
  "RITU KUMARI",
  "SACHIN HANSDA",
  "SHAHITYAA D",
  "RANJIT FULE",
  "HIMANSHU CHOUDHARY",
  "PRIYANSHU CHAUDHARY",
  "HIMANSHU DHASMANA",
  "MANISH MAHTO",
  "RISHABH MITTAL",
  "SANWAT JAT",
  "AKASH SHAH",
  "Tushar",
  "Shreyesh Sharma",
  "Omkesh Mitkari",
  "HARSHAL PARTEKE",
  "AVNEESH PANDEY",
  "MANOJAN KARAYI",
  "SHAHVIR JUNGALWALA",
  "KARUNAKARAN",
  "AMOL MORE",
  "DEEPANKAR CHATTERJEE",
  "SHIVA KUMAR",
  "SHWETA BANERJEE",
  "VIRENDRA KUMAR",
  "SIDDHESH AYRE",
  "DRON AMRIT",
  "MIHIR SAHOO",
  "JITENDRA MAURYA",
  "MRIDUSMITA GOSWAMI",
  "RISHANK KATIYAR",
  "SHIVAJEE NAYEK",
  "VAMSHI SRINIVASA CHARYULU MARINGANTII",
  "SHREYA CHATURVEDI",
  "Suchita Jain",
  "Anurag Tripathi",
  "Mayank Singh",
  "ANITA ASHOK",
  "SHARLENE MIRANDA",
  "MITCHELLE D'SOUZA",
  "MOLLY GEORGE",
  "S PADMINI",
  "RANJAN KUMAR MEHER",
  "SANTOSH KUMAR DAS",
  "VANYA SINGH",
  "GAJANAN NABAR",
  "POONAM BHUTRA",
  "HARISHKUMAR BANKER",
  "KUMAR ROHIT",
  "MRITUNJAY KUMAR",
  "POONAM HASNU",
  "RAJESH MEENA",
  "SUSHIL LAXKAR",
  "CHITRA BHANDARI",
  "PRADEEP KUMAR",
  "AVINASH SINGH",
  "RASHMI",
  "SAKTIRAJ BISWAL",
  "LALIT MOHAN SINGH",
  "PRIYANK SHENDE",
  "ROHAN VIJAY",
  "VINAY POGU",
  "NILESH GHUGE",
  "ABHISHEK D",
  "PALLAB SARKAR",
  "RAJESH KUMAR MEENA",
  "VINIT KUMAR PANCHAL",
  "SHAILESH GHANMODE",
  "SIMRANJEET SINGH",
  "DHRUV RAWAL",
  "VASANT KESARI",
  "VENKATA SABBI",
  "VIJAYAGANAPATHI E",
  "SARVESH KANOJIA",
  "SIDDHANT JANGAM",
  "RAJNI HAOKIP",
  "NIKITA CHOUDHARY",
  "PEEYUSH GOYAL",
  "Sundar R",
  "SUNEET NEGI",
  "BIRANCHI NARAYAN SAHOO",
  "PRASANTA MAHAPATRA",
  "AMIT TANDON",
  "JAYAMANJU",
  "JAINENDRA SHANDILYA",
  "SUGADEV",
  "LAXMAN SWAMI",
  "SUBASH SETHY",
  "SACHIN YADAV",
  "DINESH JOSHI",
  "ASHISH KUMAR",
  "SHYAM RAO",
  "DIVYA KULSHRESTHA",
  "EDWARD HILLARY MARANDI",
  "JANGCHON LHOUVUM",
  "MANISH BUNDEL",
  "PRASENJIT DEY",
  "RAJKUMAR PATRA",
  "SRINIVASAN T",
  "SUNIL KUMAR SINGH",
  "PREETI PATHAK",
  "VIKAS SUKHWAL",
  "RAVI MEENA",
  "SUMIT KUMAR YADAV",
  "ANURAG PAL",
  "MICKY KHER",
  "Rakesh Mohan",
  "Darshana",
  "Kumar Abhishek",
  "Hari Anand",
  "Shashank Gangwar",
  "KAREN D'SOUZA",
  "SHILPA TAWADE",
  "MYRA RODRIGUES",
  "ANNE LEWIS",
  "MOHAMMAD ALVI",
  "AISHEE SENGUPTA",
  "AYAN MUKHERJEE",
  "RIPZONG LEPCHA",
  "JASLEEN DUA",
  "SIDDHANT KHETAWAT",
  "ARPIT SHIVHARE",
  "RISHI MAHESHWARI",
  "ROHAN AHLUWALIA",
  "ISHA RAI",
  "VIJAYAKRISHNAN G",
  "SUDHA RANI THIRUKONDA",
  "DURGESH THAKUR",
  "VINAY RAJNEESH",
  "DIVYANG TRIVEDI",
  "Vineeth Benoy",
  "VIDYA SHIROOR",
  "PRITHWIS SARKAR",
  "DEEPAK WADHWA",
  "MEENU",
  "OBBATTU KUMAR",
  "AKSHAY MISHRA",
  "AYUSH JAIN",
  "DEEPAK SAROJ",
  "NIKHIL UTTA",
  "SHALVI MISHRA",
  "SEKHAR",
  "SACHIN SONAWANE",
  "JAI SEBASTIAN",
  "RAKESH SINGH",
  "SIDDHARTH",
  "SHASHWAT DUBEY",
  "ANDREA PERES",
  "MOHAMED RAHAZ",
  "RAMAN",
  "LATA MENON",
  "S JAYARAMAN",
  "HARINI KARKERA",
  "BINDU S",
  "ANAND TENDOLKAR",
  "AVINASH DHUMAL",
  "SANDEEP DIVEKAR",
  "SAROJ KUMAR SAHU",
  "SISIR MONDAL",
  "MARC LALROHLAN",
  "ESHA KAPOOR",
  "KUMAR ABHISHEK",
  "RAHUL PAWAR",
  "SATYAPRIYA BEHERA",
  "ARUN",
  "RISHI KHATOD",
  "BINAY KUMAR",
  "MADHU PANWAR",
  "KIRAN CHANDRAKANT SAWANT",
  "SUNITHA LAVDIYA",
  "HARSH CHAUDHARY",
  "SACHIN KUMAR",
  "SAI KONERU",
  "TAMMANA RANI",
  "MUKUL GOYAL",
  "ANOOP TANTIA",
  "GIRISH TIWARI",
  "NILADRI SARKAR",
  "PRADEEP GILL",
  "PRASHANT KUMAR",
  "SHABEEH P",
  "GOPAVARAPU ALEKHYA",
  "SUMIT KARVEKAR",
  "GARVIT GUPTA",
  "Rajaswit Das",
  "SHARAD SHARMA",
  "JEEVAN SONPAROTE",
  "AMRITA SHUKLA",
  "SAPNA SINHA",
  "SRISHTI AMBOKAR",
  "VISHAL PADOLE",
  "NAVEEN SAXENA",
  "GAGAN WADHWA",
  "SHAMEEN AHAMMED",
  "JOE PRADEEP",
  "N MURALIKRISHNAN",
  "NARENDRA RAWAT",
  "SAMRAT DUTTA",
  "AMAN JAIN",
  "BITHIN MAHANTA",
  "ARADHANA VERMA",
  "NEHA SOMAITHAKUR",
  "Akshay Singh",
  "Thota Balaji Kumar",
  "Ashutosh Parauha",
  "Sushma Upadhyayula",
  "Neha Noopur",
  "Gaurav Kumar",
  "RANEE MICHELLE RODRIGUES",
  "SAVITHA MENON",
  "VIDHYA",
  "MRIDUL RASTOGI",
  "SRIKANT KUMAR MISHRA",
  "MANISH TEKRIWAL",
  "SUNIL KUMAR",
  "DARSHIL BHATT",
  "POOJA DHINGRAA",
  "ARUN SHUKLA",
  "PRATEEK ARORA",
  "APPIN GOTHWAL",
  "VIKRAM BHAVARLAL SHAH",
  "ABHINAV CHOUDHARY",
  "ANUPAM KUMAR",
  "SANOOP SREEDHAR",
  "SUNIL METRY",
  "SWARUP MISHRA",
  "KENNEDY RINA",
  "NEETU PANGTEY",
  "BODAGALA SWETHA",
  "MUNINDRA KUMAR",
  "RAJVARDHAN THAKUR",
  "DEVENDRA MEENA",
  "ASHUTOSH AGRAWAL",
  "KAPIL SONI",
  "PAWAN GOEL",
  "VISHWBAHU TRIVEDI",
  "Pankaj Singh Charan",
  "MRITYUNJAYA BEHERA",
  "NIRDOSH MINZ",
  "HRUDA RANJAN SAHOO",
  "LAMBER SINGH",
  "SUSANTA KUMAR SAHOO",
  "ASHISH SINGH",
  "SUBHASH SINDURIA",
  "NAVEEN SHARMA",
  "VISHAL SHUKLA",
  "RICHA AGARWAL",
  "SANDEEP KRIPLANI",
  "BIPLAB BASUMATARY",
  "TANUJA DASARI",
  "SUMEET GUPTA",
  "RASHMI SHARMA",
  "Abhishek Rana",
  "Anuvesh Nigam",
  "Himani Mittal",
  "Siddhant Agasti",
  "Dhanush Reddy Sadhu",
  "Shivam Bhatt",
  "Vishal Gawande",
  "Naveen Kumar",
  "Aditya",
  "PRATIK KUMAR",
  "COLEEN D SOUZA",
  "SANDHYA KUMAR",
  "ANSUMAN PRADHAN",
  "DEBASHIS BANDYOPADHYAY",
  "DEEPAK TRIVEDI",
  "YOGESH DUDI",
  "NANU KAUR",
  "CHANDA SAKET",
  "ASHUTOSH RAWAT",
  "MEETU AGGARWAL",
  "VIPUL JAIN",
  "GAFRANA ANJUM",
  "ANUPAM SAMANTA",
  "DEEPSHIKHA LOHMORH",
  "AMIT MAWAI",
  "ISHPREET SINGH",
  "RAVI PRAKASH JAISWAL",
  "MANI KUMAR",
  "SATYANSH MAURYA",
  "AMIT PRADHAN",
  "VIR SINGH",
  "GYANENDRA NIRAJ",
  "KSHAMA WAGHERKAR",
  "RAJEEV RASTOGI",
  "RAKESH KUMAR",
  "PRANJAL JAYASWAL",
  "RAVINDER KUMAR",
  "KUNAL KISHOR BHARTI",
  "SIMRAN KAUR",
  "BOHNIMAAN DUTTA",
  "RUCHA SURANGE",
  "Vinayak",
  "Pallavi Ahuja",
  "Suchishmita Roy",
  "PR RAJASEKARAN",
  "SUNIL KUMARI",
  "GURVINDER BHATIA",
  "WTSP SARMA",
  "SUNIL KADAM",
  "SADUNENI SREENATH",
  "A V RAO",
  "MEETESH PATEL",
  "PRIYADARSHINI KURUP",
  "KIRAN",
  "MADHABI BUCH",
  "ROSHAN CHERIAN",
  "SANGEETA RATHOD",
  "BIBHUDUTTA SAMAL",
  "MURUGAN",
  "NILIMA KARANDIKAR",
  "DIANA CASTELINO",
  "ANITA PALANI",
  "HARIHARAN",
  "RAYUDU",
  "KATY DAMANIA",
  "PATRICIA CRASTO",
  "GLADYS LASRADO",
  "RAHUL KELAPURE",
  "ASHOK NIMBEKAR",
  "RAHUL POSWAL",
  "KAPIL KARDAM",
  "SRIKESH BHAT",
  "SUNDARESAN",
  "DOEL SAHA",
  "JAYANTHI GOPALAKRISHNAN",
  "ANAND BAIWAR",
  "PEEYUSH SONI",
  "ANDREA TRINDADE",
  "AMARJEET SINGH",
  "JEANETTE CARVALHO",
  "IVY BARNES",
  "GIRRAJ PRASAD GARG",
  "Pramod Rao",
  "JACINTA SALDANHA",
  "RUCHI CHOJER",
  "BINDHU CHERIAN",
  "VARUN SHIVHARE",
  "Lovekesh",
  "ROHINI PAI",
  "SUJIT PRASAD",
  "JULIET QUADROS",
  "VISHAL VISHWAS",
  "CHERYL D SOUZA",
  "SVMD RAO",
  "NEETIKA RAJPAL",
  "AMIT ANAND",
  "PRADIP BHOWMICK",
  "ANJAN PATEL",
  "DIVYA KHURANA",
  "MALU SEAL",
  "EVITA EDWARDS",
  "RAJA",
  "ABHISHEK PANDYA",
  "VIRAL PAREKH",
  "ROHAN SINGH MEENA",
  "DHARMAPPA N BAGALI",
  "KOMAL MAHAJAN",
  "MAHESH KHANDARE",
  "VINAYAK SRINIVASAN",
  "RAJESH NAGAR",
  "GARRY SINGH",
  "KRISHNANAND RAGHAVAN",
  "SAHIL MALIK",
  "BALA KUMARI",
  "VANDANA KUMAR",
  "MANJESH S",
  "DEEPTI AGRAWAL",
  "ANITA DADLANI",
  "Nihal Machineni",
  "Anish Bhakat",
  "LORRAINE SEQUEIRA",
  "SHERYL FERNANDES",
  "KALA RAJINI",
  "ANANT SHAKTI",
  "AAVID KHAN",
  "ABHISHEK SINGH",
  "DEEPU THOMAS",
  "AMIT YADAV",
  "OMKAR NIHALANI",
  "SURENDRA",
  "SANGRAM KESHARI MALLICK",
  "POOJA AHUJA",
  "ALVINE LYNGWA",
  "ROBIN BABY",
  "Gautham Mani Barathi",
  "INFANTA CONCEICAO",
  "MARIGOLDE D SILVA",
  "VALERIE REGO",
  "ASHWANI BHATIA",
  "Ananth Narayan Gopalakrishnan",
  "MARY BARRETTO",
  "DEEPIKA THAKUR",
  "BAL KISHOR MANDAL",
  "NAVPREET SINGH",
  "SIDDHARTH DACHALWAL",
  "M R VENKATESH BABU",
  "AMY MENON",
  "REGINA DAYAL",
  "RESHMA GOEL",
  "PANKAJ BHAGERIA",
  "GYANENDRA KUMAR",
  "MOHITA SAURBH DAHIYA",
  "VIVEK YADAV",
  "ANAMIKA AHIR",
  "RUJUTA KADAM",
  "SARAVANAN",
  "AVINASH KISHORE",
  "ARNAVAAZ PRINTER",
  "ANITHA ANOOP",
  "VENKATESHWARLU",
  "RAVIKUMAR",
  "KUNDAN RAMTEKE",
  "NAVEEN MAVI",
  "BHUMIKA SINGH",
  "DEBADUTTA SWAIN",
  "KAPIL SANKHLA",
  "Vidisha Bora",
  "SURA REDDY",
  "ANUBHAV ROY",
  "DEEPU ANANDAN",
  "JAI PARKASH",
  "Akhilesh Sanjeevi",
  "Krottapalli Krishna",
  "Amar Das",
  "NIKUNJ",
  "JOSEPHINE FERNANDES",
  "KIRTIKUMAR JADHAV",
  "PANKAJ SHINDE",
  "SHAILESH PINGALE",
  "AASHU",
  "DINESH GHUSINGA",
  "SANJAY DHAKITE",
  "BHARTENDRA GUPTA",
  "JENY JOHN",
  "VEENA KUMARI",
  "CHAKRAVARTI TUMMALAPALLI",
  "ILANGO",
  "ANKUR GUPTA",
  "SUSHMITA SETHI",
  "ANUJ KAME",
  "SARANYA ARJUNAN",
  "ANKITA GUPTA",
  "BHAWANA",
  "JAYESH THAKUR",
  "SURAJ KUMAR",
  "ANITA KENKARE",
  "RAKKAMMAL RAVI",
  "GOMATHI",
  "BENOY MELSHIYAR",
  "SUCHISMITA SAHOO",
  "SURAJ",
  "Hafis Gafoor",
  "SANKARARAMAN",
  "JAISHREE",
  "RAJESWARI",
  "KRISHNAVENI",
  "ANURAG YADAV",
  "ABHAS LANGDE",
  "ANJARUL SHAIKH",
  "YATRI VITEKAR",
  "ATANU PAN",
  "JENNIFER BRAGANZA",
  "KAMALA RAWAT",
  "BALAKRISHNAN",
  "AMIT NIGAM",
  "MANISH GUPTA",
  "SONIA SHAH",
  "NITESH BHANDARI",
  "ABHISHEK KOTHARI",
  "KSHITIJ ADNYAN SORDE",
  "VISHAL CHOUDHARY",
];

const departmentdata = [
  "Alternative Investment Fund and Foreign Portfolio Investors Department",
  "Corporation Finance Department",
  "Corporation Finance Investigation Department",
  "Central Public Information Officer",
  "Department of Debt and Hybrid Securities",
  "Department Economic and Policy Analysis",
  "Enquiries and Adjudication Department",
  "Enforcement Department",
  "Eastern Regional Office",
  "General Services Department",
  "Human Resources Department",
  "Internal Inspection Department",
  "Investment Management Department",
  "Integrated Surveillance Department",
  "Information Technology Department",
  "Investigations Department",
  "Legal Affairs Department",
  "Market Intermediaries Regulation and Supervision Department",
  "Market Regulation Department",
  "National Institute of Securities Markets",
  "Northern Regional Office",
  "Office of Chairperson",
  "Office of Executive Director",
  "Office of International Affairs",
  "Office of Investor Assistance and Education",
  "Office of Whole Time Member",
  "PACL",
  "Quasi Judicial Cell",
  "RO LO Cell",
  "Refund and Recovery Department",
  "RTI",
  "SEBI",
  "Special Enforcement Cell",
  "Southern Regional Office",
  "Vigilance Department",
  "Western Regional Office",
];

function performFuzzySearch(data, query) {
  const miniSearch = new MiniSearch({
    fields: ["name"],
    storeFields: ["name"],
  });

  const indexedData = data.map((name, id) => ({ id: `data_${id}`, name }));
  const indexedDepartmentData = departmentdata.map((name, id) => ({
    id: `dept_${id}`,
    name,
  }));
  miniSearch.addAll([...indexedData, ...indexedDepartmentData]);
  const queryWords = query.split(" ");
  const matchingNames = [];
  queryWords.forEach((queryWord) => {
    const results = miniSearch.search(queryWord);
    results.forEach((result) => {
      matchingNames.push(result.name);
    });
  });

  return matchingNames;
}

const query = "i want to know the details of Office of Chairperson";
const matchedNames = performFuzzySearch(data, query);
// const firstNames = matchedNames.map((name) => name.split(" ")[0]);
if (matchedNames.length > 1) {
  console.log("Matched Names:", matchedNames);
} else {
  console.log("Single Matched Name:", matchedNames);
}
