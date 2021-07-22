module.exports = class Compiler {
	constructor(opts = {}) {
		this.verbose = opts.verbose === undefined ? false : opts.verbose;
	}
	compile(scene) {
		let frag = "";
		frag += require('./glsl/constants.js');
		frag += require('./glsl/precision.js');
	 	frag += require('./glsl/uniforms.js')(scene)
		frag += require('./glsl/structs.js');
		frag += require('./glsl/utilities.js');
		frag += require('./glsl/objects.js')(scene);
		frag += require('./glsl/global.js')(scene);
		frag += require('./glsl/lights.js')(scene);
		frag += require('./glsl/raymarch.js');
		frag += require('./glsl/shade.js');
		frag += require('./glsl/main.js');
		frag = frag.replace(/\t/g, '');
		if (this.verbose) {
			console.log("Compilation result: ");
			let lines = frag.split('\n');
			for (let i = 0; i < lines.length; i++) console.log(i + ": " + lines[i]);
		}
		return frag;
	}
};
