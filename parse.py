from html.parser import HTMLParser

class MyParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.depth = 0
    def handle_starttag(self, tag, attrs):
        if tag in ['body', 'section', 'div', 'main', 'header', 'footer']:
            classes = next((v for k, v in attrs if k == 'class'), '')
            ids = next((v for k, v in attrs if k == 'id'), '')
            print('  ' * self.depth + f'<{tag} class="{classes}" id="{ids}">')
            self.depth += 1
    def handle_endtag(self, tag):
        if tag in ['body', 'section', 'div', 'main', 'header', 'footer']:
            self.depth -= 1

with open('index.html', 'r', encoding='utf-8') as f:
    parser = MyParser()
    parser.feed(f.read())
