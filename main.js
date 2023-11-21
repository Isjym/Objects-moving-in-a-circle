const midMiniGameContainer = document.querySelector("#mid-mini-game-container");
const userBufferContainer = document.querySelector("#user-picked-items-container");
const miniGameTaskContainer = document.querySelector("#mini-game-task-container");
const miniGameTimer = document.querySelector("#mini-game-timer");

const miniGameItemsClassName = "mini-game-item";
const taskContainerClassName = "task-container";
const bufferItemClassName = "bufferItem";

const hoverItemSoundFx = new Audio("");
const selectItemSoundFx = new Audio("");

const easyDifficultyArray = ["1C", "55", "BD", "E9"];
const normalDifficultyArray = [];
const hardDifficultyArray = [];

let firstTaskNumberOfTasks = 3;
let secondTaskNumberOfTasks = 4;
let thirdTaskNumberOfTasks = 4;
let taskCorrectCheckArray = [[], [], []];
let bufferArray = [];
let bufferSize = 6;

let miniGameCreated = false;
let activeColumn = true;
let maxRowCount = 0;
let miniGameTimerInterval = null;
let currentTimerAmount = 0; //in ms
let timerAmount = 0;
let userPickAmount = 0;


//
currentTimerAmount = 60000;
maxRowCount = 5;
let foo = createMiniGameBoard("mini-game-easy");
createMiniGameItems(easyDifficultyArray, 25, 5, foo);
addMiniGameItemsLogic(["", "column0", "row0"], miniGameItemsClassName, maxRowCount);
createBufferSlots();
createMiniGameTasks(easyDifficultyArray);
//


function createMiniGameBoard(className)
{
	let createNewHtmlElement = document.createElement("div");

	createNewHtmlElement.classList.add(className);
	midMiniGameContainer.appendChild(createNewHtmlElement);

	return document.getElementsByClassName(className)[0];
}


function createMiniGameItems(difficultyArray, allGameBoardSlots, maxRowSlots, htmlElements)
{
	let columnIndex = 0;
	let rowIndex = 0;

	for(let i = 0; i < allGameBoardSlots; i++)
	{
		let randomIndexNumber = Math.floor(Math.random() * difficultyArray.length);
		let createNewHtmlElement = document.createElement("div");

		createNewHtmlElement.classList.add(miniGameItemsClassName);
		createNewHtmlElement.classList.add(`column${columnIndex}`);
		createNewHtmlElement.classList.add(`row${rowIndex}`);
		createNewHtmlElement.innerHTML = difficultyArray[randomIndexNumber];
		htmlElements.appendChild(createNewHtmlElement);

		if(rowIndex === maxRowSlots - 1)
		{
			columnIndex++;
			rowIndex = 0;
		}else
		{
			rowIndex++;
		}
	}
}


function addMiniGameItemsLogic(selectedItemClasses, miniGameItemsClassName)
{
	const allMiniGameItems = document.getElementsByClassName(miniGameItemsClassName);

	removeMiniGameItemsLogic(allMiniGameItems);

	for(let i = 0; i < allMiniGameItems.length; i++)
	{
		let miniGameItemClassArray = allMiniGameItems[i].getAttribute("class").split(" ");

		if(activeColumn)
		{
			if(miniGameItemClassArray[1] === selectedItemClasses[1])
			{
				if(!miniGameItemClassArray.includes("selected"))
				{
					allMiniGameItems[i].addEventListener("click", validateSelectedItem);
					allMiniGameItems[i].addEventListener("mouseover", addPreviewSelected);
					allMiniGameItems[i].addEventListener("mouseout", removePreviewSelected);
				}

				addActiveClassNames(allMiniGameItems[i], miniGameItemClassArray);
			}
		} else if(!activeColumn)
		{
			if(miniGameItemClassArray[2] === selectedItemClasses[2])
			{
				if(!miniGameItemClassArray.includes("selected"))
				{
					allMiniGameItems[i].addEventListener("click", validateSelectedItem);
					allMiniGameItems[i].addEventListener("mouseover", addPreviewSelected);
					allMiniGameItems[i].addEventListener("mouseout", removePreviewSelected);
				}

				addActiveClassNames(allMiniGameItems[i], miniGameItemClassArray);
			}
		}
	}

	if(activeColumn)
	{
		activeColumn = false;
	} else if(!activeColumn)
	{
		activeColumn = true;
	}
}


function addActiveClassNames(allMiniGameItems, miniGameItemClassArray)
{
	let classIndex = 0;
	let columnRow, firstActiveItem, lastActiveItem, activeItem = "";

	if(activeColumn)
	{
		columnRow = "row";
		firstActiveItem = "firstActiveColumnItem";
		lastActiveItem = "lastActiveColumnItem";
		activeItem = "activeColumnItem";
		classIndex = 2;
	}else
	{
		columnRow = "column";
		firstActiveItem = "firstActiveRowItem";
		lastActiveItem = "lastActiveRowItem";
		activeItem = "activeRowItem";
		classIndex = 1;
	}

	if(miniGameItemClassArray[classIndex] === `${columnRow}0`)
	{
		allMiniGameItems.classList.add(firstActiveItem);
	} else if(miniGameItemClassArray[classIndex] === columnRow + (maxRowCount - 1))
	{
		allMiniGameItems.classList.add(lastActiveItem);
	} else
	{
		allMiniGameItems.classList.add(activeItem);
	}
}


function removeMiniGameItemsLogic(allItems)
{
	for(let i = 0; i < allItems.length; i++)
	{
		allItems[i].removeEventListener("click", validateSelectedItem);
		allItems[i].removeEventListener("mouseover", addPreviewSelected);
		allItems[i].removeEventListener("mouseout", removePreviewSelected);
		allItems[i].classList.remove("firstActiveColumnItem");
		allItems[i].classList.remove("activeColumnItem");
		allItems[i].classList.remove("lastActiveColumnItem");
		allItems[i].classList.remove("firstActiveRowItem");
		allItems[i].classList.remove("activeRowItem");
		allItems[i].classList.remove("lastActiveRowItem");
		allItems[i].classList.remove("predictedItem");
	}
}


function validateSelectedItem(event)
{
	event.target.classList.add("selected");

	const selectedItem = event.target.getAttribute("class").split(" ");

	if(!miniGameCreated)
	{
		miniGameCreated = true;
		miniGameTimerUpdate();
	}

	addMiniGameItemsLogic(selectedItem, selectedItem[0], maxRowCount);
	addSelectedItemToBuffer(event.target.innerHTML);
	validateBufferWithTasks(event.target.innerHTML);
	//check for tasks
}


function addPreviewSelected(event)
{
	let everyPredictedItem;

	if(!activeColumn)
	{
		everyPredictedItem = document.getElementsByClassName(event.target.getAttribute("class").split(" ")[2]);
	} else
	{
		everyPredictedItem = document.getElementsByClassName(event.target.getAttribute("class").split(" ")[1]);
	}

	for(let i = 0; i < everyPredictedItem.length; i++)
	{
		everyPredictedItem[i].classList.add("predictedItem");
	}
}


function removePreviewSelected(event)
{
	let everyPredictedItem;

	if(!activeColumn)
	{
		everyPredictedItem = document.getElementsByClassName(event.target.getAttribute("class").split(" ")[2]);
	} else
	{
		everyPredictedItem = document.getElementsByClassName(event.target.getAttribute("class").split(" ")[1]);
	}

	for(let i = 0; i < everyPredictedItem.length; i++)
	{
		everyPredictedItem[i].classList.remove("predictedItem");
	}
}


function createMiniGameTasks(difficultyArray)
{
	let taskLength;

	for(let i = 0; i < 3; i++)
	{
		let newParentHtmlElement = document.createElement("div");

		newParentHtmlElement.classList.add(taskContainerClassName);

		switch ( i )
		{
			case 0:
			{
				taskLength = firstTaskNumberOfTasks;
				newParentHtmlElement.classList.add("mini-game-first-task-container");
				break;
			}
			case 1:
			{
				taskLength = secondTaskNumberOfTasks;
				newParentHtmlElement.classList.add("mini-game-second-task-container");
				break;
			}
			case 2:
			{
				taskLength = thirdTaskNumberOfTasks;
				newParentHtmlElement.classList.add("mini-game-third-task-container");
				break;
			}
			default:{}
		}

		miniGameTaskContainer.appendChild(newParentHtmlElement);

		for(let j = 0; j < taskLength; j++)
		{
			let randomIndex = Math.floor(Math.random() * difficultyArray.length);
			let newChildHtmlElement = document.createElement("div");
			newChildHtmlElement.classList.add(`mini-game-task`);
			newChildHtmlElement.classList.add(`mini-game-task-nr${j}`);
			newChildHtmlElement.innerHTML = difficultyArray[randomIndex];
			newChildHtmlElement.addEventListener("mouseover", addTaskItemHighlightOnHover);
			newChildHtmlElement.addEventListener("mouseout", removeTaskItemHighlightOnHover);
			newParentHtmlElement.appendChild(newChildHtmlElement);

		}
	}
}


function createBufferSlots()
{
	for(let i = 0; i < bufferSize; i++)
	{
		let newHtmlElement = document.createElement("div");
		newHtmlElement.classList.add(bufferItemClassName);
		userBufferContainer.appendChild(newHtmlElement);
	}
}


function addSelectedItemToBuffer(value)
{
	const bufferElements = document.querySelectorAll(".bufferItem");

	bufferElements[userPickAmount].innerHTML = value;
	userPickAmount++;

	if(userPickAmount === bufferElements.length)
	{
		endMiniGame();
	}
}


function validateBufferWithTasks(event)
{
	let allTasksArray = document.querySelectorAll(`.${taskContainerClassName}`);

	bufferArray.push(event);

	for(let i = 0; i < allTasksArray.length; i++)
	{
		let taskClassArray = allTasksArray[i].getAttribute("class");
		let tasksArray = allTasksArray[i].children;
		let index = taskCorrectCheckArray[i].length;

		for(let j = 0; j < bufferArray.length; j++)
		{
			let failedTasks = document.querySelectorAll(".task-failed");
			let tasksCompleted = document.querySelectorAll(".task-completed");

			if(!(taskClassArray.includes("task-completed") || taskClassArray.includes("task-failed")))
			{
				if(tasksArray[index].innerHTML === bufferArray[j] && taskCorrectCheckArray[i][index - 1] === true ||
				   tasksArray[index].innerHTML === bufferArray[j] && taskCorrectCheckArray[i].length === 0)
				{
					if(taskCorrectCheckArray[i].length === 0 || j === bufferArray.length - 1)
					{
						taskCorrectCheckArray[i].push(true);
						tasksArray[index].classList.add("pick-correct");
					}

					if(tasksArray.length === taskCorrectCheckArray[i].length)
					{
						allTasksArray[i].classList.add("task-completed");

						for(let y = 0; y < tasksArray.length; y++)
						{
							tasksArray[y].classList.remove("pick-correct");
						}
					}
				} else if(j === bufferArray.length - 1)
				{
					if(taskCorrectCheckArray[i].length !== 0)
					{
						taskCorrectCheckArray[i] = [];

						for(let y = 0; y < tasksArray.length; y++)
						{
							tasksArray[y].classList.remove("pick-correct");
						}
					}

					if((bufferSize - bufferArray.length) < tasksArray.length)
					{
						allTasksArray[i].classList.add("task-failed");
					}
				}
			}

			if(failedTasks.length === 3)
			{
				j = bufferArray.length;
				console.log("all tasks failed");
				endMiniGame();
			} else if(tasksCompleted.length === 3)
			{
				j = bufferArray.length;
				console.log("all tasks completed");
				endMiniGame();
			} else if((failedTasks.length + tasksCompleted.length) === 3)
			{
				j = bufferArray.length;
				console.log("some tasks completed");
				endMiniGame();
			}
		}
	}
}

function addTaskItemHighlightOnHover(elementValue)
{
	let allMiniGameItems = document.querySelectorAll(`.${miniGameItemsClassName}`);

	for(let i = 0; i < allMiniGameItems.length; i++)
	{
		if(allMiniGameItems[i].innerHTML === elementValue.target.innerHTML)
		{
			allMiniGameItems[i].classList.add("highlightItem");
		}
	}
}

function removeTaskItemHighlightOnHover(elementValue)
{
	let allMiniGameItems = document.querySelectorAll(`.${miniGameItemsClassName}`);

	for(let i = 0; i < allMiniGameItems.length; i++)
	{
		if(allMiniGameItems[i].innerHTML === elementValue.target.innerHTML)
		{
			allMiniGameItems[i].classList.remove("highlightItem");
		}
	}
}


function endMiniGame()
{
	removeMiniGameItemsLogic(document.querySelectorAll(`.${miniGameItemsClassName}`));
	clearInterval(miniGameTimerInterval);
}


//
//adding the timer for the mini-game
//


function miniGameTimerUpdate()
{
	clearInterval(miniGameTimerInterval);
	currentTimerAmount = currentTimerAmount / 10;
	timerAmount = currentTimerAmount;
	miniGameTimerInterval = setInterval(countDownTimer, 10);
}


function countDownTimer()
{
	let seconds = Math.floor(currentTimerAmount / 100);
	let milliSeconds = currentTimerAmount % 100;
	let miniGameTimerCss = getComputedStyle(miniGameTimer).getPropertyValue("--timerWidth");

	miniGameTimerCss = miniGameTimerCss.replace("%", "");

	if(String(seconds).length === 1 && String(milliSeconds).length === 1)
	{
		miniGameTimer.innerHTML = `0${seconds} : 0${milliSeconds}`;
	} else if(String(seconds).length === 1)
	{
		miniGameTimer.innerHTML = `0${seconds} : ${milliSeconds}`;
	}else if(String(milliSeconds).length === 1)
		{
			miniGameTimer.innerHTML = `${seconds} : 0${milliSeconds}`;
		}else
		{
			miniGameTimer.innerHTML = `${seconds} : ${milliSeconds}`;
		}

	miniGameTimer.style.setProperty('--timerWidth', `${100 * currentTimerAmount / timerAmount}%`);
	currentTimerAmount--;

	if(seconds <= 0 && milliSeconds <= 0)
	{
		removeMiniGameItemsLogic(document.getElementsByClassName(miniGameItemsClassName));
		clearInterval(miniGameTimerInterval);
	}
}
