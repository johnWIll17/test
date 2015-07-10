presentTable();

function setCookie(name, value, expires, path, domain)	{
	var cookie = name + "=" + value  + ";";

	if(expires)	{
		if(expires instanceof Date)	{
			if(isNaN(expires.getTime()))	{
				expires = new Date();
			}
		}
		else expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 5 * 60);
		cookie += "expires=" + expires.toGMTString() + ";";
	}
	if(path)	{
		cookie += "path=" + path + ";";
	}
	if(domain)	{
		cookie += "domain=" + domain + ";";
	}
	document.cookie = cookie;
} 

function getCookie(name)	{
	var re = new RegExp(name + "=([^;]+)"); 
	var value = re.exec(document.cookie); 
	return (value != null) ? unescape(value[1]) : null;
}

function deleteCookie(name)	{
	if(getCookie(name))	{
		setCookie(name, "", -1);
	}
}

function clearTable()	{
	var grids = document.getElementsByClassName("drag-position");  //get all the grids in table which allows dragging
	for(var i = 0; i < grids.length; i++)	{
		if(grids[i].childNodes.length > 0)	{
			grids[i].removeChild(grids[i].firstChild);
		}
	}
}

function saveTable()	{
	var subjectsArr = new Array();
	var arr = new Array();
	var table = document.getElementsByTagName("TABLE")[0];
	for(var i = 1; i < table.rows.length; i++)	{
		for(var j = 1; j < table.rows[i].cells.length; j++)	{
			var text = table.rows[i].cells[j].textContent;
			if(text !== null)	{
				arr.push(text);
			}
		}
		subjectsArr.push(arr);	//multidimensional array contains subjects of. subjectsArr[row][column]
		arr = new Array();
	}
	var serializedArr = JSON.stringify(subjectsArr);	//serialize
	setCookie("timetable", serializedArr, null, null);
	alert("Save timetable successful");
	console.log(document.cookie);
}

function presentTable()	{
	if(getCookie("timetable"))	{
		var serializedArr = getCookie("timetable");
		var arr = JSON.parse(serializedArr);		//deserialized
		var table = document.getElementsByTagName("TABLE")[0];
		for(i = 1; i < table.rows.length; i++)	{
			for(j = 1; j < table.rows[i].cells.length; j++)	{
				var h3 = document.createElement("H3");
				h3.textContent = arr[i-1][j-1];
				h3.className = "drag-element";
				h3.style.cursor = "move";
				table.rows[i].cells[j].appendChild(h3);	//table grids start at row 1, column 1
			}
		}
	}
}

function logOut()	{
	deleteCookie("user");
	window.location.href = "login_form3.html";
}