'use strict';


// Constructor function for images from the JSON file

function Image (image) {
  this.url = image.image_url;
  this.title = image.title;
  this.description = image.description;
  this.keyword = image.keyword;
  this.horns = image.horns;
}

Image.allImages = [];
let keywords = [];

Image.prototype.render = function() {
  console.log('render function')
//   let template = $('#photo-template').html();
  let template = $('photo-template').html();
  let templateRender = Handlebars.compile(template);
  return templateRender(this);
  // let imageClone = $('section[class="clone"]');
  // let imageHtml = $('#photo-template').html();
  // imageClone.html(imageHtml);
  // imageClone.find('h2').text(this.title);
  // imageClone.find('img').attr('src', this.url);
  // imageClone.find('p').text(this.description);
  // imageClone.removeClass('clone');
  // imageClone.attr('class', this.keyword);
};

Image.readJson = (file) => {
  // emptying allImages to prepare for new images
  Image.allImages = [];
  // empties keyword array to prepare for new keywords
  keywords = [];
  $.get(file, 'json')
  .then(data => {
    console.log('data:', data);
    data.forEach(item => {
      Image.allImages.push(new Image(item));
      if (!keywords.includes(item.keyword)) {
        keywords.push(item.keyword);
      }
    });
  })
  .then(Image.loadImages)
  .then(Image.appendKeywords);
};

Image.loadImages = () => {
  $('section').remove();
  console.log(Image.allImages)
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

$(() => {
  console.log('added event listener');
  $('select').on('change', function() {
    console.log('CLICK!');
    if (this.value === 'all') {
      $('section').show();
    } else if (this.value !== 'default') {
      $('section').hide();
      // let key = event.target.value;
      $(`section[class="${this.value}"]`).show();
      console.log('end of event listener');
    }
  });
});

$(() => {
  $('#page-nav button').on('click', (e) => {
    console.log('this:', e.target);
    // if (this.type === 'button') {
      if (e.target.value === 'one') {
        console.log('clicked button one', e.target.value);
        Image.readJson('../data/page-1.json');
      } else {
        console.log('clicked button two');
        Image.readJson('../data/page-2.json');
      }
    // }
  })
})

$(() => Image.readJson('../data/page-1.json'));
