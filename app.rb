#!/usr/bin/env ruby

require 'rubygems'
require 'bundler'
require 'tempfile'
require 'fileutils'

Bundler.require

### SETUP

set :bind, '0.0.0.0'
set :server, :puma
set :haml, format: :html5

VIDEO_DIR = ENV['VIDEO_DIR'] || './videos'

FileUtils.mkdir_p(VIDEO_DIR)


### ROUTES

get '/' do
  @color_from, @color_to = random_gradient
  haml :index
end

post '/' do
  if params[:video] && params[:video][:tempfile]
    copy_video(params[:video][:tempfile], File.extname(params[:video][:filename]))
  else
    haml :index
  end
end


### HELPERS

helpers do
  def copy_video(stream, extension)
    temp = Tempfile.new(['video', extension])
    begin
      while chunk = stream.read(65536)
        temp.write(chunk)
      end
      FileUtils.mv(temp, File.join(VIDEO_DIR, Time.now.strftime('%Y%m%d%H%M%S') + extension))
      201
    rescue => e
      logger.error(e)
      [500, e.message]
    ensure
      temp.close
      temp.unlink
    end
  end

  def random_gradient
    file = File.join(File.dirname(__FILE__), 'resources', 'gradients.json')
    json = JSON.parse(File.read(file))
    json.sample.fetch('colors')
  end
end
