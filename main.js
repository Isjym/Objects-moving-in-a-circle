//
//Aninmation controll
//

//Play animation

function play_animation()
{
	const elements = document.querySelectorAll(".circle-animation");

	elements.forEach(animation => {
		animation.style.animationPlayState = 'running';
	})
}
//
//Pause animation
//
function pause_animation()
{
	const elements = document.querySelectorAll(".circle-animation");

	elements.forEach(animation => {
		animation.style.animationPlayState = 'paused';
	})
}
