import unittest
from production.business.imagedata import *

__author__ = 'scorpio'


class ImageDataTest(unittest.TestCase):
    def bounds_to_json_test(self):
        bounds = Bounds(0, 20, 100, 200)

        result = bounds.to_json()

        expected = '{"y": 20, "x": 0, "w": 100, "h": 200}'

        self.assertEqual(result, expected)

    def flashcard_to_json_test(self):
        card = FlashCard(1, "horse1.jpg")
        card.sound = "horse4.mp3"
        card.original_image_size = Bounds(0, 0, 2000, 1500)
        card.landscape_bounds = Bounds(30, 100, 550, 100)
        card.portrait_bounds = Bounds(200, 20, 100, 550)

        result = simplejson.dumps(card.to_json_dict())

        expected = '{"sound": "horse4.mp3", "index": 1, "image": "horse1.jpg", ' \
                   '"originalImageSize": {"y": 0, "x": 0, "w": 2000, "h": 1500}, ' \
                   '"portraitBounds": {"y": 20, "x": 200, "w": 100, "h": 550}, ' \
                   '"landscapeBounds": {"y": 100, "x": 30, "w": 550, "h": 100}}'

        self.assertEqual(result, expected)

    def deck_to_json_test(self):
        deck = Deck(2, "Horse")
        deck.thumb = "horseThumb1.jpg"

        card1 = FlashCard(1, "horse1.jpg")
        card1.sound = "horse4.mp3"
        card1.original_image_size = Bounds(0, 0, 2000, 1500)
        card1.landscape_bounds = Bounds(30, 100, 550, 100)
        card1.portrait_bounds = Bounds(200, 20, 100, 550)

        card2 = FlashCard(1, "horse2.jpg")
        card2.sound = "horse5.mp3"
        card2.original_image_size = Bounds(0, 0, 2000, 1500)
        card2.landscape_bounds = Bounds(30, 100, 550, 100)
        card2.portrait_bounds = Bounds(200, 20, 100, 550)

        deck.cards.append(card1)
        deck.cards.append(card2)

        expected = ""

        result = simplejson.dumps(deck.to_json_dict())

        self.assertEqual(expected, result)

    def can_load_from_json_file_test(self):
        with open('/Users/scorpio/Dev/Projects/baby-flashcard-app/media/data.json') as json_file:
            image_data = ImageData()
            #json_string = '{ "sets": [ { "id": 1, "name": "domestic" } , { "id": 2, "name": "safari" }   ]}'
            image_data.load_from_json(json_file)

        self.assertEqual(3, len(image_data.deck_sets[0].decks))

    def can_write_image_data_to_json_test(self):
        image_data = ImageData()
        with open('/Users/scorpio/Dev/Projects/baby-flashcard-app/media/data.json') as json_file:
            image_data.load_from_json(json_file)

        json_str = simplejson.dumps(image_data.to_json_dict())

        self.assertTrue(len(json_str) > 50)

        with open('/Users/scorpio/Dev/Projects/baby-flashcard-app/media/data2.json', 'w') as outfile:
            simplejson.dump(image_data.to_json_dict(), outfile, indent=2)

    def can_load_backlog_test(self):
        path = '/Users/michaelishmael/Dev/Projects/baby-flashcard-app/proudction-ui/media'
        workflow = Workflow(path)
        workflow.load()

        self.assertTrue(len(workflow.backlog) > 10)
        self.assertTrue(len(workflow.sounds) > 10)