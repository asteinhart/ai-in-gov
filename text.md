TODO
* finish all the todos
* figure out where to put conversation about missing data

Technical TODO
data
* start with sorted by department (start_dep_[x/y])
* split by top my department (split_dep_[x/y])
* switch to sorted by technique (start_t_[x/y])
* split by top by technique (split_t_[x/y])
* switch to sorted by ds (start_dev_[x/y])
* split by top by technique (split_dev_[x/y])



JS todo
* way point to color 4 based on a list 
* make function for starting location (no animation)
* make function for separate location (animation) 
* drop down function (col, input) to highlight
* create color lookups
* create labeling options



In October 2023, the Biden Administration issued an [executive order on AI](https://www.whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/) to advance agencies’ efforts across the federal government, building on previous actions to harness the benefits and mitigate the risks of AI. "The Executive Order [establishes](https://www.whitehouse.gov/briefing-room/statements-releases/2023/10/30/fact-sheet-president-biden-issues-executive-order-on-safe-secure-and-trustworthy-artificial-intelligence/) new standards for AI safety and security, protects Americans’ privacy, advances equity and civil rights, stands up for consumers and workers, promotes innovation and competition, advances American leadership around the world, and more."

One under reported aspect of the executive order requires "the Director of [the Office of Management and Budget] shall, on an annual basis, issue instructions to agencies for the collection, reporting, and publication of agency AI use cases"

To comply with this order, the federal government publicly shared  "Federal AI Use Case Inventory" on [ai.gov](ai.gov). 


As more advanced technology becomes more prevalent in federal state and local government we must be aware and who these technology products hurt and help There are many promising and encouraging uses of machine learning and AI currently but a blind faith that these technologies can solve all inefficiently and issue in government is a mislead belief. 

---- 

As a quick aside, its worth mentioning the impact that the format of data can have the accessability and usability. One of the principles of posted by [resources.data.gov](https://resources.data.gov/), an online repository of policies, tools, case studies, and other resources to support data governance, management, exchange, and use throughout the federal government, is that the data is [accessible](https://resources.data.gov/PoD/principles/) meaning that open data from the government should be "made available in convenient, modifiable, and open formats..." and "...should be made available to the widest range of users for the widest range of purposes, often by providing the data in multiple formats for consumption."

Unfortunately, this is rarely upheld as anyone that works with government data knows that you never know what format the data will be in. One of the most common formats are PDFs which are often easy to view on a computer but much more difficult to access the data to analyze and are not [machine-readable](https://resources.data.gov/glossary/machine-readable-file/). On the flip side, tabular data formats like CSVs or Excel files are machine-readable but impossible or at the least difficult to analyze. 

There are governments addressing these concerns by providing "multiple formats for consumption" including machine readable formats as well as dashboards, charts, and maps to allow users with a variety of technical skills to still access and use the data. The City of Chicago's [Open Data Portal](https://data.cityofchicago.org/) is one example. 

----


Clicking this link begins a download of a csv file. I will give them one point for providing a machine readable format and then promptly take a point away for just providing a 710 row CSV file. This format is essentially useless for most people. They neglect to provide any summary statistics or way to view the inventory in a table . As the federal governments own principles outline, this does feel "available to the widest range of users for the widest range of purposes."

To this end, scroll along below to explore how the Federal Government has reported its use of AI. If you would like skip to a sortable table of the entire inventory, click here.



* This list contains 710 "use cases of AI" as of September 1st 2023. Each box represents one use case. For example, the National Oceanic and Atmospheric Administration runs VOLcanic Cloud Analysis Toolkit (VOLCAT), an application system for detecting, tracking, characterizing, and forecasting hazardous volcanic events. At any point, hover over or click a box to learn more about the specific model.

[all the use cases as a square in a grid] 27*27 or 10*71

* The use cases are reported across 21 departments and agencies. AI use is now widespread in government. All 15 executive departments have as least one report AI use case. Just two departments, the Department of Energy  (178 uses) and the Department of Health and Human Services (157) make up almost half of all reported use cases in the inventory. The Department of Commerce (49), Department of Homeland Security (41), and Department of Veterans Affairs (40) round of the top 5 departments or agencies. Use the drop down to highlight a specific department.

[split up by top 5 and other]
[drop down to highlight other departments]


* What exactly is considered a "use case of AI"? The collected inventory shows that the federal government struggles to provide a clear understanding ([as many other do as well](https://ludic.mataroa.blog/blog/i-will-fucking-piledrive-you-if-you-mention-ai-again/)).
The inventory includes use cases that range from chatbots using [Large Language Models](link) machine learning models using 

1. machine learning 
2. chat bots DOC-0005-2023
3. analytics DHS-0029-2023
4. statistical model DOC-0011-2023

[highlight these use cases I am mentioning (animate subsequently with i.... )]

* While the inventory included a `Technique` field, it is relatively useless as there are not standardized categories across departments as well as over half of uses cases not having a listed technique. Despite it being labeled as mandatory in the [provided instructions to agencies](), over 50% of use cases have no listed a technique. The TODO departments listed technique, TODO blank and blank listed not technique.

[highlight all the models with no listed technique]

To better understand the uses cases, I reviewed the use case listed technique (if provided), titles and summary information, to create mg own groupings. TODO Blank % of the models were this and that. See all the categories I created using the drop down. 

Find additional information about what each category means here.
TODO

[split them up by tech_edit, top 5]
[dropdown to highlight selected one]

* In additional to technique, only 17 use cases how public available source code


* Also included in the use case inventory is information that indicates its stage in development. Once again, despite being a mandatory field in the [provided instruction](link) (TODO), just under 50% had not listed development stage. 

[highlight no development stage]

* Of the use cases that did includes a development stage, roughly 50% are currently in use, a quarter are in development and a quarter are in planning. As expected, it appears the use of AI in the federal government will continue to increase considering the amount of uses in development or planning.   
1. drop down footnote TODO, this list once again was edit to correct for slight name differences across departments, things like aligning in "In-use" and "In-production" to the same category.

[split by development false]



This inventory is not only outdated at this point, but also incredibly incomplete as shown below.  I believe this review should be understand as just the tip of the iceberg of government use 


While reviewing the [guidelines](link) for the inventory, there appears to be lots of value information that was collected that was not shared in this instal release. This includes questions such as TODO.
It appears this initial release was a collection of each  of each department [posted page](https://ai.gov/ai-use-cases/). One may be able to get some of this information by viewing the inventory from each individual department's link [here](https://ai.gov/ai-use-cases/) or this may be a possible good [FIOA request](https://www.muckrock.com/). 


Optional but includes

* Optional Data Approach
Did/does the agency train this AI use case?"	"6B.
If yes - Where did/does the training data originate?"	"6C.
Is the training data, the validation data, and/or test data included in the enterprise data inventory? "	"6D.
If data is publicly available, provide link. "

* Optional Technical Solution
"7A.
Does the agency have access to the code associate with this AI use case?"	"7B.
If yes, is the code included in the agency source code inventory (e.g. Code.gov)?"	"7C.
 If the source code is publicly available, provide the link."	"7D.
Is the agency able to conduct ongoing testing on the code?"	"7E.
Is the agency able to monitor and/or audit performance? "

*  Developer Information in house or off the shelf


Explore the inventory yourself using the table below, access the the original dataset via [csv] or [Google Sheet](). or download my additionally labeled version of the inventory via [Google Sheet]().





https://codebeautify.org/markdown-to-html



--- methodology

Additional Notes About the Data
* It appears this posted data set is a accumulation of each department [posted page](https://ai.gov/ai-use-cases/)
* Find all altercations to the orginal inventiry data set in this python notebook, including decisions in grouping development stage and techniques.

