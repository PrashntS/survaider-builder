var tour;

tour = new Shepherd.Tour({
  defaults: {
    classes: 'shepherd-theme-arrows',
    scrollTo: false
  }
});

tour.addStep('add-question', {
  title: 'Adding the Survey Questions',
  text: 'You can drag and drop the questions to add them to your survey.',
  attachTo: '.sb-add-field-types right',
  buttons: [
    {
      text: '&times;',
      classes: 'btn-close',
      action: tour.cancel
    },
    {
      text: 'Next',
      action: tour.next
    }
  ]
});

tour.addStep('add-question', {
  title: 'Your survey is built in this area',
  text: 'Go ahead, re arrange your questions, or click on them to customize them.',
  attachTo: '.sb-field-wrapper left',
  buttons: [
    {
      text: '&times;',
      classes: 'btn-close',
      action: tour.cancel
    },
    {
      text: 'Next',
      action: tour.next
    }
  ]
});

tour.addStep('add-question', {
  title: 'Time for the Magic to happen!',
  text: "Once you're done, watch your survey turning into a game!",
  attachTo: '.play-now bottom',
  buttons: [
    {
      text: '&times;',
      classes: 'btn-close',
      action: tour.cancel
    },
    {
      text: 'Next',
      action: tour.next
    }
  ]
});

$(function () {
  setTimeout(function () {
    //tour.start();
  }, 1000);
});
