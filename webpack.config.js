module.exports = {
    entry: __dirname+'/src/scripts/main.jsx',
    output: {
        path: __dirname + '/dist/assets/',
        filename: 'main.js'
    },
  resolve: {
    // Tell webpack to look for required files in bower and node
    modulesDirectories: ['node_modules'],
  },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.jsx$/, loader: 'jsx-loader' },
        ]
    }
};
