const mainText = `
A wiki is a form of online hypertext publication, collaboratively edited and managed by its own audience, using a web browser. A typical wiki contains multiple pages for the subjects or scope of the project, and could be either open to the public or limited to use within an organization for maintaining its internal knowledge base.

Wikis are enabled by wiki software, otherwise known as wiki engines. A wiki engine, being a form of a content management system, differs from other web-based systems such as blog software, in that the content is created without any defined owner or leader, and wikis have little inherent structure, allowing structure to emerge according to the needs of the users.[1] Wiki engines usually allow content to be written using a simplified markup language and sometimes edited with the help of a rich-text editor.[2] There are dozens of different wiki engines in use, both standalone and part of other software, such as bug tracking systems. Some wiki engines are free and open-source, whereas others are proprietary. Some permit control over different functions (levels of access); for example, editing rights may permit changing, adding, or removing material. Others may permit access without enforcing access control. Further rules may be imposed to organize content.

There are hundreds of thousands of wikis in use, both public and private, including wikis functioning as knowledge management resources, note-taking tools, community websites, and intranets. Ward Cunningham, the developer of the first wiki software, WikiWikiWeb, originally described wiki as "the simplest online database that could possibly work".[3] "Wiki" (pronounced [wiki][note 1]) is a Hawaiian word meaning "quick".[4][5][6]

The online encyclopedia project Wikipedia is the most popular wiki-based website, and is one of the most widely viewed sites in the world, having been ranked in the top twenty since 2007.[7] Wikipedia is not a single wiki but rather a collection of hundreds of wikis, with each one pertaining to a specific language. The English-language Wikipedia has the largest collection of articles: as of July 2023, it has over six million articles. 
`;

let listOfWords = [];
let wordsOccurences = {};
let ordered;
let commonWords = [];
let wordsToExclude;
let selectedText = "";

const numberOfMainTopResults = 4;
const  distance = 10;

const wordsPattern = /[a-z]+/ig;

const defaultWordsToExclude = ["of", "the", "a", "an", "to", "and", "is", "are", "was", "were", "I", "he", "she", "his", "her", "they", "them", "as", "or", "for", "by", "in", "with"];
wordsToExclude = [...defaultWordsToExclude];

let inputArea;
let resultArea;
let exclusionArea;
let specificArea;
let wordInfo;


function GetTextElements()
{
    if(inputArea == null || resultArea == null || exclusionArea == null || specificArea == null || wordInfo == null)
    {
        inputArea = document.getElementById("inputArea");
        resultArea = document.getElementById("resultArea");
        exclusionArea = document.getElementById("exclude");
        specificArea = document.getElementById("specific");
        wordInfo = document.getElementById("wordInfo");
    }
}


function FindDifferentWords()
{
    let textFound = inputArea.value.toLowerCase();

    listOfWords = textFound.match(wordsPattern);
    listOfWords = listOfWords.filter(word =>
        (selectedText == "") ?
            (
                (specificArea.value == "") ? 
                exclusionArea.value.toLowerCase().match(wordsPattern).includes(word) == false : 
                specificArea.value.toLowerCase().match(wordsPattern).includes(word)
            ) :
        selectedText.toLowerCase().match(wordsPattern).includes(word));
}


function GetWordsOccurences()
{
    wordsOccurences = {};
    
    // count
    listOfWords.map((word) => {
        (wordsOccurences.hasOwnProperty(word)) ?
            wordsOccurences[`${word}`] += 1 :
            wordsOccurences[`${word}`] = 1;
    })

    // sort
    let sorted = Object.entries(wordsOccurences).sort((a, b) => b[1] - a[1]);
    commonWords = [...sorted];
}


function PresentResult()
{
    resultArea.textContent = commonWords.map(wordPair => wordPair[0] + "(" + wordPair[1] + ")\n");
}


function Main()
{
    GetTextElements();
    FindDifferentWords();
    GetWordsOccurences();
    PresentResult();
}


function AddExampleToInput()
{
    GetTextElements();
    inputArea.value = mainText;
}


function ResetExclusionList()
{
    GetTextElements();
    exclusionArea.value = defaultWordsToExclude;
}


ResetExclusionList();
AddExampleToInput();
Main();


window.addEventListener("mouseup", (event) => {
    let activeElement = document.activeElement;
    if(activeElement != null)
    {
        if(activeElement.tagName.toLowerCase() == "textarea")
        {
            selectedText = activeElement.value.slice(activeElement.selectionStart, activeElement.selectionEnd);
        }
        else
        {
            selectedText = window.getSelection().toString();
        }

        if(selectedText != "")
        {
            Main();

            wordInfo.style.left = event.pageX + distance + "px";
            wordInfo.style.top = event.pageY + distance + "px";

            wordInfo.textContent = (commonWords.length > 0) ? commonWords : "No Match Found";

            wordInfo.style.visibility = "visible";
        }
        else
        {
            wordInfo.style.visibility = "hidden";
        }
    }
});