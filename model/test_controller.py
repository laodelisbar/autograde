import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import json
import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

# Download necessary NLTK resources
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('averaged_perceptron_tagger_eng')
nltk.download('stopwords')
nltk.download('wordnet')

# Load pre-trained model
try:
    model = tf.keras.models.load_model('model_2.h5')
    logging.info("Model loaded successfully.")
except Exception as e:
    logging.error(f"Error loading model: {e}")
    raise

# Load tokenizer
try:
    with open('tokenizer.json') as f:
        data = json.load(f)
        tokenizer = tf.keras.preprocessing.text.tokenizer_from_json(data)
        logging.info("Tokenizer loaded successfully.")
except Exception as e:
    logging.error(f"Error loading tokenizer: {e}")
    raise

# Helper function to map NLTK POS tags to WordNet POS tags
def get_wordnet_pos(treebank_tag):
    if treebank_tag.startswith('J'):
        return wordnet.ADJ
    elif treebank_tag.startswith('V'):
        return wordnet.VERB
    elif treebank_tag.startswith('N'):
        return wordnet.NOUN
    elif treebank_tag.startswith('R'):
        return wordnet.ADV
    else:
        return wordnet.NOUN  # Default to noun

# Main preprocessing function
def preprocess_text(text):
    if not isinstance(text, str):
        return ""

    # 1. Lowercasing
    text = text.lower()

    # 2. Remove numbers
    text = re.sub(r'\d+', '', text)

    # 3. Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))

    # 4. Tokenization
    tokens = nltk.word_tokenize(text)

    # 5. Remove stop words
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]

    # 6. Lemmatization
    pos_tags = nltk.pos_tag(tokens)
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word, get_wordnet_pos(pos)) for word, pos in pos_tags]

    # 7. Join tokens back into a single string
    return ' '.join(tokens)

def predict_text(input_premise, input_hypothesis):
    try:
        logging.info("Starting text preprocessing...")
        # Preprocess inputs
        input_premise = [preprocess_text(text) for text in input_premise]
        input_hypothesis = [preprocess_text(text) for text in input_hypothesis]
        logging.info("Text preprocessing completed.")

        # Tokenize inputs
        max_length = 15  # Use the same max_length used during training
        premise_seq = tokenizer.texts_to_sequences(input_premise)
        hypothesis_seq = tokenizer.texts_to_sequences(input_hypothesis)
        logging.info(f"Tokenization completed. premise_seq: {premise_seq}, hypothesis_seq: {hypothesis_seq}")

        # Pad sequences
        premise_pad = pad_sequences(premise_seq, maxlen=max_length, padding='post')
        hypothesis_pad = pad_sequences(hypothesis_seq, maxlen=max_length, padding='post')
        logging.info(f"Padding completed. premise_pad: {premise_pad}, hypothesis_pad: {hypothesis_pad}")

        # Run model and get predictions
        predictions = model.predict([premise_pad, hypothesis_pad])
        logging.info(f"Prediction completed : {predictions.tolist()}")

        # Subtract 1 from each element in the predicted list
        adjusted_classes = [1 - pred[0] for pred in predictions.tolist()]

        return {"predicted": adjusted_classes}
    except Exception as e:
        logging.error(f"Error in predict_text: {e}")
        raise