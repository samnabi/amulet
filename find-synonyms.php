<?php
require('config.php');

$word = $_GET['q'];
$filepath = 'thesaurus'.DIRECTORY_SEPARATOR.urlencode($word).'.json';

if (file_exists($filepath)) {
  // We've already fetched this word from the thesaurus
  $synonyms = file_get_contents($filepath);
} else {
  // Ask the thesaurus
  // Use an environment variable to fetch the API key
  $response = file_get_contents('https://www.dictionaryapi.com/api/v3/references/ithesaurus/json/'.$word.'?key='.THESAURUS_KEY);

  // Let's find those synonyms
  $synonyms = json_encode([]);
  $response_array = json_decode($response);
  if (is_array($response_array)) {
    $thesaurus_word = $response_array[0];
    if (is_object($thesaurus_word) and in_array($thesaurus_word->fl, ['verb', 'adjective', 'noun'])) {
      $synonyms = json_encode($thesaurus_word->meta->syns[0], JSON_PRETTY_PRINT);
    }
  }

  // Save the data to a file
  file_put_contents($filepath, $synonyms);
}

// Echo the data
echo $synonyms;

?>