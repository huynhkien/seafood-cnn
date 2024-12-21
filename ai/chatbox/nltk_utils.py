import numpy as np
import nltk
# nltk.download('punkt_tab') Load module để phân tích câu từ
from nltk.stem.porter import PorterStemmer
stemmer = PorterStemmer()


def tokenize(sentence):
    """
    Phân chia câu thành các từ 
    """
    return nltk.word_tokenize(sentence)


def stem(word):
    """
    Chỉ trả về từ đã chuyển về dạng chữ thường. Tạo nên sự nhất quán
    """
    return word.lower()


def bag_of_words(tokenized_sentence, words):
    """
    tokenized_sentence: danh sách các từ được tách
    word: từ vựng
    """
    # tạo danh sách chuẩn hóa các chữ cái trong từ, sentence_words chứa các chữ cái được chuẩn hóa
    sentence_words = [stem(word) for word in tokenized_sentence]
    # khởi tạo bag = 0 cho mỗi từ
    bag = np.zeros(len(words), dtype=np.float32)
    # Sử dụng vòng lặp duyệt qua các từ trong word
    for idx, w in enumerate(words):
        # trường hợp w có trong danh sách thì giá trị idx trong mảng bag là 1 nếu không thì sẽ 0
        if w in sentence_words: 
            bag[idx] = 1

    return bag