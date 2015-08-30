var tour;

tour = new Shepherd.Tour({
  defaults: {
    classes: 'shepherd-theme-arrows',
    //scrollTo: true
  }
});

tour.addStep('add-question', {
  title: 'Adding the Survey Questions',
  text: 'You can drag and drop the questions to add them to your survey.',
  attachTo: '.fb-add-field-types right',
  classes: 'shepherd-theme-arrows',
  scrollTo: false,
  buttons: [
    {
      text: 'Next',
      action: tour.next
    }
  ]
});

tour.addStep('add-question', {
  title: 'Your survey is built in this area',
  text: 'Go ahead, re arrange your questions, or click on them to customize them.',
  attachTo: '.fb-field-wrapper left',
  classes: 'shepherd-theme-arrows',
  buttons: [
    {
      text: 'Next',
      action: tour.next
    }
  ]
});

tour.addStep('add-question', {
  title: 'Time for the Magic to happen!',
  text: 'Once youre done, go and eat some food.',
  attachTo: '.play-now bottom',
  classes: 'shepherd-theme-arrows',
  buttons: [
    {
      text: 'Next',
      action: tour.next
    }
  ]
});

setTimeout(function () {
  "use strict";
  tour.start();
});
