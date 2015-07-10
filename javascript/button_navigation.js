function showElementById(id)	{
	document.getElementById(id).style.visibility = "visible";	
}

function hideElementById(id)	{
	document.getElementById(id).style.visibility = "hidden";	
}

function enableElementById(id)	{
	document.getElementById(id).disabled = false;
}

function disableElementById(id)	{
	document.getElementById(id).disabled = true;
}

function showSubjects(categoryId)	{
	hideElementById("category-container");
	showElementById("subject-container");
	showElementById("subject-container-header");
	hideElementById("search-container");
	hideElementById("setting-container");
	enableElementById("search-button");

	var subjects = document.getElementsByClassName("category");
	for(var i = 0; i < subjects.length; i++)	{
		if(subjects[i].id === categoryId)	{
			subjects[i].style.display = "block";
		}
		else subjects[i].style.display = "none";
	}	
}

function backToCategories()	{
	hideElementById("subject-container");
	hideElementById("subject-container-header");
	showElementById("category-container");
	disableElementById("search-button");	
}

function showSearchPanel()	{
	hideElementById("subject-container-header");
	showElementById("search-container");
}


function showSettingPanel()	{
	hideElementById("category-container");
	hideElementById("subject-container");
	hideElementById("search-container");
	showElementById("setting-container");
	disableElementById("search-button");
}

function searchSubject(subjectName)	{
	//find out which category panel is displayed
	var categoryPanels = document.getElementsByClassName("category");
	var chosenCategoryPanel = null;
	for(var i = 0; i < categoryPanels.length; i++)	{
		if(categoryPanels[i].style.display !== "none")	{
			chosenCategoryPanel = categoryPanels[i];
			break;
		}
	}

	if(chosenCategoryPanel !== null)	{
		var subjectList = chosenCategoryPanel.childNodes[1].childNodes;		//HTML ul object
		for(var i = 0; i < subjectList.length; i++)	{
			if(subjectList[i].nodeName !== "#text")	{
				var subjectItem = subjectList[i];							//HTML li object
				if(subjectItem.childNodes[3].textContent.search(new RegExp(subjectName, "i")) != -1)	{
					subjectItem.style.display = "block";
				}
				else subjectItem.style.display = "none";
			}
		}
	}
}