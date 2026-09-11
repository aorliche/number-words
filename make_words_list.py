import re

# Only non-proper nouns without any punctuation
valid_re = re.compile('^[a-z]+$')

words = []

with open('/usr/share/dict/words') as f:
    for word in f:
        word = word.strip()
        # No proper nouns, punctuation, or less than three-letter words
        if valid_re.match(word) and len(word) > 2:
            # Remove most plurals
            if len(words) == 0 or word[:len(word)-1] != words[-1]:
                words.append(word)

for word in words:
    print(word)
