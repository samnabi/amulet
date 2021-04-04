# Amulet scratchpad (multiverse edition)

## What's an amulet?

Start by reading [Robin Sloan's explanation of amulets](https://text.bargains/amulet/).

## Demo

Try out the amulet scratchpad (multiverse edition) here: [amulet.samnabi.com](https://amulet.samnabi.com)

## About this app

Creating an amulet from scratch is no easy task. You might go through hundreds of versions of a poem, trying different variations of wording and capitalisation, before stumbling upon one that qualifies as an amulet.

We can use computers to help us generate amulets — feed a massive set of words into an algorithm and comb though the results to find one that's particularly poetic. But where's the fun in that?

This scratchpad attempts to strike a middle ground. As you write your poem, it will scan the multiverse for similar poems — these could use different capitalisation, or synonyms of the words you've written. The exact poem you wrote might not be an amulet, but a similar one could very well be.

If stumbling upon an amulet is like rolling dice, this scratchpad loads the dice in your favour.

This app uses the [Merriam-Webster thesaurus API](https://www.dictionaryapi.com/products/api-collegiate-thesaurus) to find synonyms. There is a daily usage limit of 1,000 requests, so the app uses a PHP script to save the requests locally. This avoids requesting the same words over and over.

## Getting started

To run this on your own server, you'll need:

- PHP
- A developer API key for the [Merriam-Webster Collegiate Thesaurus API](https://www.dictionaryapi.com/products/api-collegiate-thesaurus)

### Configuration

Rename `config-sample.php` to `config.php`, and enter your API key.

The `config.php` file is included in `.gitignore`, to avoid accidentally committing the secret API key to a public repository. So, you might have to re-create the `config.php` file when you push the project to a production server.

### Caching

To avoid querying the thesaurus API repeatedly, this app saves the thesaurus results in JSON files. These files are saved under `thesaurus/{word}.json`. The name of the file is the word, and its contents are an array of synonyms.

`find-synonyms.php` is the file that handles querying the thesaurus API. If a local `.json` file for the word exists, it uses that data instead.

There isn't a method to clear this cache, so if you want to fetch fresh data from the thesaurus API, you'll have to delete the corresponding file manually.

## Contributing

If you have questions, bug fixes, or feature requests, please don't hesitate to open an issue here on GitHub. I won't bite.

## Why no NFTs?

By using this app you agree not to create NFTs of the amulets you make. I just don't think NFTs are a net good for society, culture, or the planet. If you want to discuss this further, open an issue and let's talk.
