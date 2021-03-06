ALL_TASKS = ['jst:all', 'coffee:all', 'concat:all', 'sass:all', 'cssmin:dist']

# formbuilder.js must be compiled in this order:
# 1. rivets-config
# 2. Links SVG builder
# 3. main
# 4. fields js
# 5. fields templates

module.exports = (grunt) ->

  path = require('path')
  exec = require('child_process').exec

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-jst')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-release')
  #grunt.loadNpmTasks('grunt-karma')

  grunt.initConfig

    pkg: '<json:package.json>'
    srcFolder: 'src'
    compiledFolder: 'compiled'  # Temporary holding area.
    distFolder: 'dist'
    vendorFolder: 'vendor'
    testFolder: 'test'

    jst:
      all:
        options:
          namespace: 'Formbuilder.templates'
          processName: (filename) ->
            signalStr = "templates.pluggable/" #strip extra filepath and extensions
            filename.slice(filename.indexOf(signalStr)+signalStr.length, filename.indexOf(".html"))

        files:
          '<%= compiledFolder %>/templates.js': '<%= srcFolder %>/templates.pluggable/**/*.html'

    coffee:
      all:
        files:
          '<%= compiledFolder %>/scripts.js': [
            '<%= srcFolder %>/scripts/underscore_mixins.coffee'
            '<%= srcFolder %>/scripts/rivets-config.coffee'
            '<%= srcFolder %>/scripts/image-picker.coffee'
            '<%= srcFolder %>/scripts/main.coffee'
            '<%= srcFolder %>/scripts/fields/*.coffee'
          ]

    concat:
      all:
        files:
          '<%= distFolder %>/formbuilder.js': [
            '<%= srcFolder %>/scripts/boner.js'
            # '<%= srcFolder %>/scripts/router.js'
            # '<%= srcFolder %>/scripts/tour.js'
            '<%= compiledFolder %>/*.js'
          ]
          '<%= vendorFolder %>/js/vendor.js': [
            'bower_components/ie8-node-enum/index.js'
            'bower_components/jquery/jquery.js'
            'bower_components/jquery-ui/ui/jquery.ui.core.js'
            'bower_components/jquery-ui/ui/jquery.ui.widget.js'
            'bower_components/jquery-ui/ui/jquery.ui.mouse.js'
            'bower_components/jquery-ui/ui/jquery.ui.draggable.js'
            'bower_components/jquery-ui/ui/jquery.ui.droppable.js'
            'bower_components/jquery-ui/ui/jquery.ui.sortable.js'
            'bower_components/jquery.scrollWindowTo/index.js'
            'bower_components/underscore/underscore-min.js'
            'bower_components/underscore.mixin.deepExtend/index.js'
            'bower_components/sightglass/index.js'
            'bower_components/rivets/dist/rivets.js'
            'bower_components/backbone/backbone.js'
            'bower_components/backbone-deep-model/src/deep-model.js'
            'bower_components/svg.js/dist/svg.min.js'
            'bower_components/sweetalert/dist/sweetalert.min.js'
            'bower_components/tether/dist/js/tether.min.js'
            'bower_components/tether-shepherd/dist/js/shepherd.min.js'
            'bower_components/js-schema/js-schema.min.js'
            'bower_components/autosize/dist/autosize.js'
            'bower_components/jsPlumb/dist/js/jsPlumb-2.0.3.js'
          ]
          '<%= vendorFolder %>/js/vendor.sans.jquery.js': [
            'bower_components/ie8-node-enum/index.js'
            'bower_components/jquery.scrollWindowTo/index.js'
            'bower_components/underscore/underscore-min.js'
            'bower_components/underscore.mixin.deepExtend/index.js'
            'bower_components/sightglass/index.js'
            'bower_components/rivets/dist/rivets.js'
            'bower_components/backbone/backbone.js'
            'bower_components/backbone-deep-model/src/deep-model.js'
            'bower_components/sweetalert/dist/sweetalert.min.js'
            'bower_components/tether/dist/js/tether.min.js'
            'bower_components/tether-shepherd/dist/js/shepherd.min.js'
            'bower_components/js-schema/js-schema.min.js'
            'bower_components/slick-carousel/slick/slick.js'
            'bower_components/opentip/lib/opentip.js'
            'bower_components/opentip/lib/adapter-jquery.js'
            'bower_components/dropzone/dist/dropzone.js'
            'bower_components/jquery.scrollTo/jquery.scrollTo.js'
            'bower_components/bootstrap3-wysihtml5-bower/dist/bootstrap3-wysihtml5.all.js'
            'bower_components/canvas-toBlob/index.js'
            'bower_components/cropper/dist/cropper.js'
          ]

    cssmin:
      dist:
        files:
          '<%= distFolder %>/formbuilder.vendor.css': [
            '<%= distFolder %>/formbuilder.css'
            'bower_components/dropzone/dist/dropzone.css'
            'bower_components/opentip/css/opentip.css'
            'bower_components/slick-carousel/slick/slick.css'
            'bower_components/slick-carousel/slick/slick-theme.css'
            'bower_components/cropper/dist/cropper.css'
          ]
          '<%= vendorFolder %>/css/vendor.css': [
            'bower_components/font-awesome/css/font-awesome.css'
            'bower_components/sweetalert/dist/sweetalert.css'
            'bower_components/tether-shepherd/dist/css/shepherd-theme-arrows.css'
            'bower_components/slick-carousel/slick/slick.css'
            'bower_components/slick-carousel/slick/slick-theme.css'
            'bower_components/dropzone/dist/dropzone.css'
            'bower_components/cropper/dist/cropper.css'
          ]

    sass:
      all:
        options:
          quiet: false
          trace:true
          style: 'expanded'

        files:
          '<%= distFolder %>/formbuilder.css': '<%= srcFolder %>/styles/formbuilder.sass'

    clean:
      compiled:
        ['<%= compiledFolder %>']

    uglify:
      dist:
        files:
          '<%= distFolder %>/formbuilder-min.js': '<%= distFolder %>/formbuilder.js'

    watch:
      all:
        files: ['<%= srcFolder %>/**/*.{coffee,sass,html,js}']
        tasks: ALL_TASKS

    # To test, run `grunt --no-write -v release`
    release:
      npm: false


  grunt.registerTask 'default', ALL_TASKS
  # grunt.registerTask 'dist', ['cssmin:dist', 'uglify:dist']
  grunt.registerTask 'dist', ['uglify:dist']
  #grunt.registerTask 'test', ['dist', 'karma']
