//
//Aninmation controll
//

//Play animation

function play_animation()
{
	const elements = document.querySelectorAll(".circle-animation");

	elements.forEach(animation => {
		const animation_status = animation.style.animationPlayState;

		animation.style.animationPlayState = 'running';
	})
}

//Pause animation

function pause_animation()
{
	const elements = document.querySelectorAll(".circle-animation");

	elements.forEach(animation => {
		const animation_status = animation.style.animationPlayState;

		animation.style.animationPlayState = 'paused';
	})
}