/*global suite*/

var kss = require('../index.js'),
  assert = require('assert'),
  common = require('./common.js'),
  path = require('path');

var KssSection = kss.KssSection,
  KssModifier = kss.KssModifier,
  styleDirectory = path.join(__dirname, '/fixtures-styles/');

common = common(styleDirectory);

suite('KssSection', function() {
  'use strict';

  common.hasMethod(new KssSection({}), 'header');
  common.hasMethod(new KssSection({}), 'description');
  common.hasMethod(new KssSection({}), 'deprecated');
  common.hasMethod(new KssSection({}), 'experimental');
  common.hasMethod(new KssSection({}), 'reference');
  common.hasMethod(new KssSection({}), 'depth');
  common.hasMethod(new KssSection({}), 'encodeReferenceURI');
  common.hasMethod(new KssSection({}), 'referenceURI');
  common.hasMethod(new KssSection({}), 'modifiers');
  common.hasMethod(new KssSection({}), 'firstModifier');

  suite('.header()', function() {
    common.testAllSections('returns section.data.header', '*.less|*.css', function(section) {
      assert.strictEqual(section.header(), section.data.header);
    });
  });

  suite('.description()', function() {
    common.testAllSections('returns section.data.description', '*.less|*.css', function(section) {
      assert.strictEqual(section.description(), section.data.description);
    });
  });

  suite('.deprecated()', function() {
    common.testAllSections('returns section.data.deprecated', '*.less|*.css', function(section) {
      assert.equal(section.deprecated(), section.data.deprecated);
    });
  });

  suite('.experimental()', function() {
    common.testAllSections('returns section.data.experimental', '*.less|*.css', function(section) {
      assert.equal(section.experimental(), section.data.experimental);
    });
  });

  suite('.reference()', function() {
    common.testAllSections('returns section.data.reference', '*.less|*.css', function(section) {
      assert.equal(section.reference(), section.data.reference);
    });
  });

  suite('.depth()', function() {
    common.testAllSections('returns section.data.depth', '*.less|*.css', function(section) {
      assert.equal(section.depth(), section.data.depth);
      assert.equal(section.depth(), section.reference().split(section.styleguide.referenceDelimiter).length);
    });
  });

  suite('.weight()', function() {
    common.testAllSections('returns section.data.weight', '*.less|*.css', function(section) {
      assert.equal(section.weight(), (section.data.weight ? section.data.weight : 0));
      assert.ok(typeof section.depth() === 'number');
    });
  });

  suite('.encodeReferenceURI()', function() {
    common.testAllSections('.encodeReferenceURI(section.reference()) equals .referenceURI()', '*.less|*.css', function(section) {
      assert.equal(section.encodeReferenceURI(section.reference()), section.referenceURI());
    });
  });

  suite('.referenceURI()', function() {
    common.testAllSections('returns section.data.referenceURI', '*.less|*.css', function(section) {
      assert.equal(section.referenceURI(), section.data.referenceURI);
      assert.equal(section.referenceURI(), section.encodeReferenceURI(section.reference()));
    });
  });

  suite('.modifiers()', function() {
    common.testAllSections('() returns section.data.modifiers', '*.less|*.css', function(section) {
      assert.strictEqual(section.modifiers(), section.data.modifiers);
    });

    common.testAllSections('() all returned should be instances of KssModifier', '*.less|*.css', function(section) {
      var modifiers = section.modifiers(),
        i, l = modifiers.length;

      for (i = 0; i < l; i += 1) {
        assert.ok(modifiers[i] instanceof KssModifier);
      }
    });

    common.testAllSections('(n) returns section.data.modifiers[n], or false if non-existent', '*.less|*.css', function(section) {
      var i, j = 5, l = section.data.modifiers.length;

      for (i = 0; i < j || i < l; i++) {
        if (i < l) {
          assert.deepEqual(section.modifiers(i), section.data.modifiers[i]);
        } else {
          assert.equal(section.modifiers(i), false);
        }
      }
    });

    common.testAllSections('("n") coerces to a number if numerical', '*.less|*.css', function(section) {
      var i, j = 5, l = section.data.modifiers.length;

      for (i = 0; i < j || i < l; i++) {
        if (i < l) {
          assert.deepEqual(section.modifiers(i), section.data.modifiers[i]);
        } else {
          assert.equal(section.modifiers(i), false);
        }
      }
    });

    common.testAllSections('("modifier") should search by name', '*.less|*.css', function(section) {
      var i, j, queries = ['.red', '.yellow', ':hover', ':disabled'],
        q = queries.length,
        l = section.data.modifiers.length;

      // Each modifier
      for (i = 0; i < l; i += 1) {

        // Each query
        for (j = 0; j < q; j += 1) {
          if (section.data.modifiers[i].data.name === queries[j]) {
            assert.deepEqual(section.modifiers(queries[j]), section.data.modifiers[i]);
          }
        }

      }
    });

    common.testAllSections('("modifier") should only return false if not found', '*.less|*.css', function(section) {
      assert.equal(false, section.modifiers('__should_not_find___'));
      if (section.data.modifiers.length) {
        assert.ok(section.modifiers(section.modifiers(0).data.name));
      }
    });
  });

  suite('.firstModifier()', function() {
    common.testAllSections('returns section.data.modifiers[0], or first if not found', '*.less|*.css', function(section) {
      if (section.data.modifiers.length) {
        assert.equal(section.firstModifier(), section.modifiers(0));
      }
    });
  });
});
