// This code is based on Recess: https://github.com/twitter/recess

const RangeFinder = require('./range-finder')

const vendorPrefixes = [
  '-webkit-',
  '-khtml-',
  '-epub-',
  '-moz-',
  '-ms-',
  '-o-'
];

const vendorPrefixRegExp = new RegExp(
  '^('
  + vendorPrefixes.join('|').replace(/[-[\]{}()*+?.,\\^$#\s]/g, "\\$&")
  + ')'
);

const hackPrefixes = [
  '_',  // IE 7
  '*'  // IE 6
];

const hackPrefixRegExp = new RegExp(
  '^('
  + hackPrefixes.join('|').replace(/[-[\]{}()*+?.,\\^$#\s]/g, "\\$&")
  + ')'
);

const properties = [
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'z-index',
  'display',
  'float',
  'width',
  'height',
  'max-width',
  'max-height',
  'min-width',
  'min-height',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'margin-collapse',
  'margin-top-collapse',
  'margin-right-collapse',
  'margin-bottom-collapse',
  'margin-left-collapse',
  'overflow',
  'overflow-x',
  'overflow-y',
  'clip',
  'clear',
  'font',
  'font-family',
  'font-size',
  'font-smoothing',
  'osx-font-smoothing',
  'font-style',
  'font-weight',
  'hyphens',
  'src',
  'line-height',
  'letter-spacing',
  'word-spacing',
  'color',
  'text-align',
  'text-decoration',
  'text-indent',
  'text-overflow',
  'text-rendering',
  'text-size-adjust',
  'text-shadow',
  'text-transform',
  'word-break',
  'word-wrap',
  'white-space',
  'vertical-align',
  'list-style',
  'list-style-type',
  'list-style-position',
  'list-style-image',
  'pointer-events',
  'cursor',
  'background',
  'background-attachment',
  'background-color',
  'background-image',
  'background-position',
  'background-repeat',
  'background-size',
  'border',
  'border-collapse',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'border-color',
  'border-image',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border-spacing',
  'border-style',
  'border-top-style',
  'border-right-style',
  'border-bottom-style',
  'border-left-style',
  'border-width',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'border-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
  'border-bottom-left-radius',
  'border-top-left-radius',
  'border-radius-topright',
  'border-radius-bottomright',
  'border-radius-bottomleft',
  'border-radius-topleft',
  'content',
  'quotes',
  'outline',
  'outline-offset',
  'opacity',
  'filter',
  'visibility',
  'size',
  'zoom',
  'transform',
  'box-align',
  'box-flex',
  'box-orient',
  'box-pack',
  'box-shadow',
  'box-sizing',
  'table-layout',
  'animation',
  'animation-delay',
  'animation-duration',
  'animation-iteration-count',
  'animation-name',
  'animation-play-state',
  'animation-timing-function',
  'animation-fill-mode',
  'transition',
  'transition-delay',
  'transition-duration',
  'transition-property',
  'transition-timing-function',
  'background-clip',
  'backface-visibility',
  'resize',
  'appearance',
  'user-select',
  'interpolation-mode',
  'direction',
  'marks',
  'page',
  'set-link-source',
  'unicode-bidi',
  'speak'
];

function sortTextLines(editor, sort) {
  const sortableRanges = RangeFinder.rangesFor(editor);

  sortableRanges.forEach((range) => {
    const textLines = editor.getTextInBufferRange(range).split(/\r?\n/g);
    const sortedTextLines = sort(textLines);
    editor.setTextInBufferRange(range, sortedTextLines.join('\n'));
  });
}

function getProperty(line) {
  let property = line;

  // Trim whitespace.
  property = property.trim();

  // Trim the colon and anything after.
  const propertyParts = property.split(':');
  property = propertyParts[0];

  return property;
}

function getSortScore(line) {
  const property = getProperty(line);

  // Get the property stripped of any prefix.
  let rootProperty = property.replace(vendorPrefixRegExp, '');
  rootProperty = rootProperty.replace(hackPrefixRegExp, '');

  let score = properties.indexOf(rootProperty);

  // Adjust the score based on prefixes.
  const vendorPrefixMatch = vendorPrefixRegExp.exec(property);
  if (vendorPrefixMatch) {
    score += vendorPrefixes.indexOf(RegExp.$1);
  } else {
    score += vendorPrefixes.length + 1;
  }
  const hackPrefixMatch = hackPrefixRegExp.exec(property);
  if (hackPrefixMatch) {
    score += hackPrefixes.indexOf(RegExp.$1);
  }

  return score;
}

function sortLines(editor) {
  sortTextLines(editor,
    (textLines) => textLines.sort(
      (line1, line2) => {
        let score1 = getSortScore(line1);
        let score2 = getSortScore(line2);

        if (score1 !== -1 && score2 !== -1) {
          if (score1 < score2) {
            return -1;
          }

          if (score1 > score2) {
            return 1;
          }
        }

        return 0;
      }
    )
  );
}

module.exports = {
  activate () {
    atom.commands.add('atom-text-editor:not([mini])', {
      'sort-css:sort' () {
        sortLines(atom.workspace.getActiveTextEditor())
      }
    })
  }
}
