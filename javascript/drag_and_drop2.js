var dragElement = null;
var dragElemBound;
var dragElemName = "drag-element", dragPosName = "drag-position";
var mousePos;
var originalPos;

document.body.onmousedown = function(ev)	{
	ev = ev || window.event;
	if(ev.target !== null && ev.target.className === dragElemName)	{
		mouseDown(ev.target);
		document.body.onmousemove = mouseMove;
		document.body.onmouseup = mouseUp;
		document.body.onclick = function()	{
			dragElement = null;
			dragElemBound = null;
		};
		return false;
	}
	if(ev.target.tagName !== "INPUT")	{
		return false;
	}
};
addEvent(document.body, "mouseout", function(ev)	{
	ev = ev || window.event;
	var from = ev.relatedTarget || ev.toElement;
	if(!from || from.nodeName === "HTML")	{
		//stop drag event here
		mouseUp();
	}
});

//mouse out event
function addEvent(obj, ev, func)	{
	if(obj.addEventListener)	{
		obj.addEventListener(ev, func, false);
	}
	else if(obj.attachEvent)	{
		obj.attachEvent("on" + ev, func);
	}
}

function mouseDown(elem)	{
	//get original position of element
	if(elem !== null  && elem.className === dragElemName)	{
		originalPos = {
						x: elem.getBoundingClientRect().left, 
						y: elem.getBoundingClientRect().top
					  };
	}
	//drag from nav --> drag the copy element
	if(elem.tagName === "LI")	{	
		dragElement = elem.childNodes[3].cloneNode(true);	//clone the element H3
		dragElement.style.display = "none";	
	}
	//drag from table --> drag the element itself
	else if(elem.tagName === "H3")	{
		dragElement = elem;
	}
	elem.parentNode.appendChild(dragElement);
}

function mouseMove(ev)	{
	ev = ev || window.event;
	if(ev.pageX === null && ev.clientX !== null)	{
		eventDoc = (ev.target && ev.target.ownerDocument) || document;
		doc = eventDoc.documentElement;
		body = eventDoc.body;

		ev.pageX = ev.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
		ev.pageY = ev.clientX + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
	}
	mousePos = {x: ev.pageX, y: ev.pageY};

	var offsetLeft = 5;
	var offsetTop = 10;
	if(dragElement !== null)	{
		document.body.style.cursor = "move";
		dragElement.style.cssText = "display: inline; position: absolute; opacity: 0.6; width: 100px; height: 50px";
		elementBound = dragElement.getBoundingClientRect();
		//set postion of drag-element relative to mouse position
		dragElement.style.left = (mousePos.x - elementBound.width * 2 + offsetLeft) + "px";
		dragElement.style.top = (mousePos.y - offsetTop) + "px";
	}
}	

function appendElementToTarget(target)	{
	if(target !== null && target.className === dragPosName)	{
		if(target.childNodes.length > 0)	{
			target.removeChild(target.firstChild);
		}
		target.appendChild(reconstruct(dragElement));
		dealloc();
	}
}

function reconstruct(elem)	{
	var node = document.createElement("H3");
	node.className = dragElemName;
	node.style.cursor = "move";
	var text = document.createTextNode(elem.textContent);
	node.appendChild(text);
	return node;
}

function dealloc()	{
	if(dragElement !== null)	{
		if(dragElement.parentNode !== null)	{
			dragElement.parentNode.removeChild(dragElement);
		}
	}
	dragElement = null;
	dragElemBound = null;
}

function mouseUp(ev)	{
	if(dragElement !== null)	{
		document.body.style.cursor = "auto";
		var target = document.elementFromPoint(mousePos.x, mousePos.y);	

		//drag from nav to table, table to table
		if(target !== null && target.className === dragPosName)	{
			appendElementToTarget(target);
		}
		//over drag
		else if(target !== null && (target.tagName === "H3" && target.className === dragElemName))	{
			appendElementToTarget(target.parentNode);
		}
		//drag from table to nav
		else if(target !== null && (target.tagName === "LI" || (target.parentNode !== null && target.parentNode.tagName === "LI")))	{
			// alert("hehe");
			dealloc();
		}
		else	{
			//if not, then move back the element to it original position
			if(target !== null && dragElement.parentNode.tagName === "TD")	{
				dragElement.style.left = originalPos.x + "px";
				dragElement.style.top = originalPos.y + "px";

				var originalTarget = document.elementFromPoint(originalPos.x, originalPos.y);
				if(originalTarget.childNodes.length > 0)	{
					originalTarget.removeChild(originalTarget.firstChild);
				}
				originalTarget.appendChild(reconstruct(dragElement));
				dealloc();
			}
			else {
				dealloc();
			}
		}
	} 
}