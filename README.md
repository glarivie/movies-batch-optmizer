# movies-batch-optmizer
A command line tool to batch convert and replace all HD videos in a directory.

## System requirements

`movies-batch-optmizer` is working well on Mac OSX and Linux.
If you use Windows check [this link](https://archive.is/xDb8o).
All you need is a recent version of `node.js` and `npm` and a fresh install of `handbrake`.

On Ubuntu:

```
sudo add-apt-repository --yes ppa:stebbins/handbrake-releases
sudo apt-get update -qq
sudo apt-get install -qq handbrake-cli
```

On Mac OSX:

```
brew install handbrake
```

## How it works ?

```
git clone https://github.com/hqro/movies-batch-optmizer
cd movies-batch-optmizer
npm install
npm run build
```

You can also install all the dependencies with the `yarn` command, and build with `yarn build`.

## Need some help ?

```
npm start -- --help
```

Output:

```
Usage: index npm start -- <...args>

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -s, --source [pathname]  source directory
    -o, --output [pathname]  output directory
    -m, --max [size]         Files with a superior size (in Mb) will be processed
```
