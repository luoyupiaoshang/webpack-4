const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const glob = require("glob");

const parts = require("./webpack.parts");


const PATHS = {
    app: path.join(__dirname, "src"),
};

const commonConfig = merge([{
        plugins: [
            new HtmlWebpackPlugin({
                title: "Webpack demo",
            }),
        ]
    }, parts.loadCSS(),

]);

const productionConfig = merge([
    parts.purifyCSS({
        paths: glob.sync(`${PATHS.app}/**/*.js`, {
            nodir: true
        }),
    }),
    parts.loadImages({
        options: {
            limit: 15000,
            name: "[name].[ext]",
        },
    }),
]);

const developmentConfig = merge([
    parts.devServer({
        // Customize host/port here if needed
        host: "0.0.0.0",
        port: process.env.PORT,
    }),
  parts.loadImages(),
]);

module.exports = mode => {
    if (mode === "production") {
        return merge(commonConfig, productionConfig, {
            mode,
            module: {
                rules: [{
                    // **Conditions** to match files using RegExp, function.
                    test: /\.js$/,
                    include: PATHS.app,
                    use: [{
                            loader: "babel-loader",
                            options: {
                                presets: ["env"],
                            },
                        },
                        // Add more loaders here
                    ],
                }, ],
            },
        });
    }

    return merge(commonConfig, developmentConfig, {
        mode
    });
};
