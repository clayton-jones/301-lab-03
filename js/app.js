'use strict';


// Constructor function for images from the JSON file

function Image (image) {
  this.image_url = image.image_url;
  this.title = image.title;
  this.description = image.description;
  this.keyword = image.keyword;
  this.horns = image.horns;
}

Image.allImages = [];
let keywords = [];

Image.prototype.render = function() {
  let template = $('#photo-template').html();
  let templateRender = Handlebars.compile(template);
  return templateRender(this);
  
};

Image.readJson = (file) => {
  // emptying allImages to prepare for new images
  Image.allImages = [];
  // empties keyword array to prepare for new keywords
  keywords = [];
  $.get(file, 'json')
  .then(data => {
    data.forEach(item => {
      Image.allImages.push(new Image(item));
      if (!keywords.includes(item.keyword)) {
        keywords.push(item.keyword);
      }
    });
  })
  .then(Image.sortByTitle)
  // .then(Image.loadImages)
  .then(Image.appendKeywords);
};

Image.loadImages = () => {
  $('section').remove();
  Image.allImages.forEach(image => {
    $('main').append(image.render());
  });
}

Image.appendKeywords = () => {
  $('option').slice(2).remove();
  keywords.forEach(key => {
    let $option = $(`<option class="${key}">${key}</option>`);
    $('select').append($option);
  });
};

Image.sortByTitle = () => {
  Image.allImages.sort((a, b) => {
    if (a.title > b.title) {
      return 1;
  }
  if (b.title > a.title) {
      return -1;
  }
  return 0;
  })
  Image.loadImages();
};

Image.sortByHorns = () => {
  Image.allImages.sort((a, b) => a.horns - b.horns);
  Image.loadImages();
};

$(() => {
  $('select').on('change', function() {
    if (this.value === 'all') {
      $('section').show();
    } else if (this.value !== 'default') {
      $('section').hide();
      $(`section[class="${this.value}"]`).show();
    }
  });
});

$(() => {
  $('#page-nav button').on('click', (e) => {
      if (e.target.value === 'one') {
        Image.readJson('./data/page-1.json');
      } else {
        Image.readJson('./data/page-2.json');
      }
  })
})

$(() => {
  $('#sort-nav button').on('click', (e) => {
    if (e.target.value === 'title') {
      console.log('Sort by title clicked');
      Image.sortByTitle();
    } else {
      console.log('Sort by horns clicked');
      Image.sortByHorns();
    }
  })
})

$(() => Image.readJson('./data/page-1.json'));
