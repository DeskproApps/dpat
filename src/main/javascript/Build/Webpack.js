const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ChunkManifestPlugin = require('webpack-chunk-hash');
const ManifestPlugin = require('chunk-manifest-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');

const DPWebpack = function(options, callback) {
  return webpack(options, callback);
};

const ownPlugins = {
  ExtractTextPlugin: ExtractTextPlugin,
  WriteFilePlugin: WriteFilePlugin,
  CopyWebpackPlugin: CopyWebpackPlugin,
  ChunkManifestPlugin: ChunkManifestPlugin,
  ManifestPlugin: ManifestPlugin,
  WebpackChunkHash: WebpackChunkHash,
};

Object.assign(DPWebpack, webpack, ownPlugins);
module.exports = DPWebpack;
