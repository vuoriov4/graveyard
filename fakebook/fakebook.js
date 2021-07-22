var fakebook = {};

fakebook.names = [
	"Addison",
	"Adrian",
	"Ainsley",
	"Alex",
	"Andy",
	"Ari",
	"Ash",
	"Aspen",
	"Aubrey",
	"Bailey",
	"Bay",
	"Blaine",
	"Bobbie",
	"Brett",
	"Brook",
	"Caelan",
	"Campbell",
	"Carroll",
	"Charlie",
	"Chris",
	"Clay",
	"Corey",
	"Dana",
	"Dakota",
	"Dale",
	"Daryl",
	"Devin",
	"Dorian",
	"Drew",
	"Eddie",
	"Eli",
	"Elliott",
	"Frances",
	"Frankie",
	"Gabriel",
	"Glenn",
	"Gray",
	"Harper",
	"Hayden",
	"Jamie",
	"Jean",
	"Jesse",
	"Jordan",
	"Jules",
	"Julian",
	"Kaden",
	"Kelly",
	"Kennedy",
	"Lake",
	"Logan",
	"Max",
	"Morgan",
	"Pat",
	"Peyton",
	"Ray",
	"Reed",
	"Riley",
	"River",
	"Roan",
	"Rudy",
	"Ryan",
	"Sage",
	"Sam",
	"Shawn",
	"Sean",
	"Stevie",
	"Tanner",
	"Taylor",
	"Toby",
	"Tyler",
	"Val",
	"West",
	"Winter"
];

fakebook.generate = function(comments) {
	var day = 2;
	var commentsHtml = comments.map(function(comment, i) {
		day += Math.floor(5*Math.random())
		var likes = "";
		if (Math.random() > 0.5) {
			likes = `
				<img width="13" style="position: relative; top: 1px;" src="https://ja.facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/thumb-drawn.svg">
				<a>${Math.floor(1+5*Math.random())}</a> <a>⋅</a>
			`
		}
		var hr = "";
		if (i < comments.length - 1) hr = '<hr>';
		return `<div class="cf-comment">
			<a><img class="cf-avatar" src="${faker.image.avatar()}"></a>
			<p><a><b>${fakebook.names[Math.floor(Math.random()*fakebook.names.length)]} ${faker.name.lastName()}</b></a></p>
			<p>${comment}</p>
			<p><a href="">Like</a> <a>⋅</a> ${likes} <a>Reply</a> <a>⋅</a> <span class="grey">${day} days ago</span></p>
		</div>
		${hr}`
	}).join('');
	return `
		<div id="cf-comments">
			<h1>Leave a comment</h1>
			<hr style="margin-bottom: 7px;">
				<b class="grey">${comments.length} comments</b>
				<a style="float: right"><b>Add a comment</b></a>
			<hr style="margin-top: 7px;">
			${commentsHtml}
		</div>
		<style>
			.cf-avatar {
				float: left;
				width: 60px;
				margin-right: 10px;
			}
			.cf-comment {
				overflow: auto;
				zoom: 1;
				margin-bottom: 10px;
			}
			#cf-comments h1 {
				margin-top: 0px;
				margin-bottom: 0px;
				font-size: 26px;
				color: #303030;
			}
			#cf-comments .grey {
				color: #808080;
			}
			#cf-comments hr {
				background-color: #d0d0d0; height: 1px; border: 0;
				margin-bottom: 10px;
				margin-top: 10px;
			}
			#cf-comments a {
				color: #3b5998;
				text-decoration: none;
				cursor: pointer;
			}
			#cf-comments {
				width: calc(100% - 20px);
				font-family: sans-serif;
				font-size: 13px;
				padding: 10px 10px 0.1px 10px;
			}
			#cf-comments p {
				line-height: 14px;
				margin-top: 5px;
				margin-bottom: 5px;
			}
		</style>
	`;
}
