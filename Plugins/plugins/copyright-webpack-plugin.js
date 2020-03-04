class CopyrightWebpackPlugin {

	apply(compiler) {

		compiler.hooks.compile.tap('CopyrightWebpackPlugin', (compilation) => {
			console.log('compiler');
		})

		compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin', (compilation, cb) => {
			compilation.assets['copyright.txt']= {
				source: function() {
					return 'copyright by xia'
				},
				size: function() {
					return 21;
				}
			};
			cb();
		})
	}

}

module.exports = CopyrightWebpackPlugin;