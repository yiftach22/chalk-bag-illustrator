var chosenPart, result={"A":null, "B":null, "C": null, "D": null, "E": null, "F": null}, fleece=null;
const GRAY=0, BROWN=1;
const url = 'https://script.google.com/macros/s/AKfycbybDLhuZSnn13NjIK95d_drJbnxOX-BdxZLAYVUToTfhChW8I4/exec';
const colors=["ffffff", "191512", "5c5450", "787068", "787068", "e3cbad", "927459", "5d4539", "6b3f29", "672332", "bd101e", "e01d2e", "ff5a2a", "f5a814", "acbc16", "006560", "279564", "1f452f", "34404a", "0068ae", "009ea6", "a3cacf", "0e77aa", "453576", "f54b86"];


for (i=1;i<26;i++){
    document.getElementById("color-"+i).addEventListener('click', makeColorFunction(i));
}





/***********************
hovering over parts list
************************/
for (i=0;i<6;i++){
    highlightOnHover ("ABCDEF"[i]);
}


function highlightOnHover(part){
    var map = document.getElementById(part + "-map");
    var list = document.getElementById(part + "-list")
    map.addEventListener("mouseover", function(){list.classList.add("parts-list-hover")});
    map.addEventListener("mouseout", function(){list.classList.remove("parts-list-hover")});
    list.addEventListener("mouseover", function(){list.classList.add("parts-list-hover")});
    list.addEventListener("mouseout", function(){list.classList.remove("parts-list-hover")});
}


jmap = $(".map")
for (i=0;i<6;i++){
    let part = String.fromCharCode(65+i); //65 = ASCII for A
    jpart = $("#" + part + "-list")
    jpart.click(function(){
        jmap.mapster('set', null, part)
        changeChosen(part)
    })
    jpart.mouseover(function(){
        jmap.mapster('highlight', part)
    })
    jpart.mouseout(function(){
        jmap.mapster('highlight',false, part)
    })
    
}


/************
random colors
*************/

document.getElementById("random-btn").addEventListener('click', randomColors);

function randomColors(){
    for (i=0;i<6;i++){
        let part = String.fromCharCode(65+i); //65 = ASCII for A
        let color=Math.ceil(Math.random()*25)
        setColor(part, color)
    }
}


/**************
choose fleece
***************/
document.getElementById("gray-fleece").addEventListener('click', function() {
    fleece=GRAY; 
    document.getElementById("gray-fleece").style.borderColor="red";
    document.getElementById("brown-fleece").style.borderColor="gray";
});
document.getElementById("brown-fleece").addEventListener('click', function() {
    fleece=BROWN;
    document.getElementById("gray-fleece").style.borderColor="gray";
    document.getElementById("brown-fleece").style.borderColor="red";
});


/************
reset button
*************/

document.getElementById("reset-btn").addEventListener('click', resetButton);

function resetButton(){
    if (window.confirm("Reset your bag?")){
        for (i=0;i<6;i++){
            setColor("ABCDEF"[i], null);
        }
    }
}


/*************
change colors
**************/

function changeChosen(newChosen){
    newChosenTitle = document.getElementById(newChosen + "-list")
    if (chosenPart===newChosen){
        newChosenTitle.classList.remove("parts-list-click");
        chosenPart=null;
    }
    else{
        newChosenTitle.classList.add("parts-list-click");
        if (chosenPart != null){
            oldChosenTitle = document.getElementById(chosenPart + "-list")
            oldChosenTitle.classList.remove("parts-list-click");
        }
        chosenPart = newChosen;
    }   
}

function makeColorFunction(color){
    function changeColor(){
        if (chosenPart){
            setColor(chosenPart, color);
        }
    }
    return changeColor;
}


function setColor(part, color){
        
        if (color===null){
            document.getElementById(part).style.display="none";
            document.getElementById(part+'-square').style.backgroundColor="";
            document.getElementById(part+'-square').style.backgroundImage="url(photos/no-choice.png)";
            result[part] = null;
            return;
        }
        document.getElementById(part).style.display="block";
        document.getElementById(part).src = "photos/"+part+"/"+part+" (" + color + ").png";
        document.getElementById(part+'-square').style.background="none";
        document.getElementById(part+'-square').style.backgroundColor = "#" + colors[color-1];
        document.getElementById(part+'-square').style.opacity="1";
        result[part]=color
}



/**********
change border for color squares
***************/
function changeBorder(element){
    element.style.border = "5px solid #555";
}

function removeBorder(element){
    element.style.border = "0px";
}


/***************
submit to forms
***************/

const form = document.forms['submit-to-google-sheet']

form.addEventListener('submit', e => {
    e.preventDefault()
    var isReadyToSubmit= checkSubmit();

    if (isReadyToSubmit==="ok"){
        if (window.confirm("Are you sure you want to submit?")){
            $('#test').load('script.php');
            var sendingData = new FormData(form);
            for (const part in result){
                sendingData.append(part, result[part]);
            }
            sendingData.append('Fleece', fleece);
            var comments = document.getElementById("comments-field").value;
            sendingData.append('Comments', comments);
            fetch(url, { method: 'POST', body: sendingData})
                .then(response => window.location.href="thanks-for-submit.html")
                .catch(error => console.error('Error!', error.message))
        }
    }
    
    else{
        if (isReadyToSubmit==="color"){
            window.alert("The bag is not finished yet. Finish all parts and submit again")    
        }
        
        else{
            window.alert("You did not choose fleece-lining color. Choose it and submit again")    
        }
    }
})

function checkSubmit(){
    for (var part in result){
        if (result[part]===null){
            return "color";
        }
        
    if (fleece === null){
        return "fleece";
    }

    }
    return "ok";
}
 



