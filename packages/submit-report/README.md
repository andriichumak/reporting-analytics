# Report grabber util

This is a CLI tool that collects the jUnit reports from provided folder and pushes them to reporting server.

## Installation

Run `npm i` to install all the dependencies.

## Usage

To execute the script run:
```
$ node /path/to/submit-report --path "/path/to/jUnit/reports/folder/**/*.xml"
```

> Note the quotes around the path pattern. Some terminals would interpret glob pattern and resolve it to a single
> file if text is not wrapped in quotes.

For more options run `node /path/to/submit-report --help`.
