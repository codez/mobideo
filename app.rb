require 'rubygems'
require 'bundler'

Bundler.require

set :bind, '0.0.0.0'
set :server, :puma
set :haml, format: :html5

ENV['APP_VIDEO_FOLDER'] = './videos' if ENV['APP_VIDEO_FOLDER'].nil?

FileUtils.mkdir_p(ENV['APP_VIDEO_FOLDER'])

get '/' do
  @color_from, @color_to = random_gradient
  haml :index
end

post '/' do
  unless params[:video] &&
         (tmpfile = params[:video][:tempfile])
    haml :index
  end

  filename = Time.now.strftime('%Y%m%d%H%M%S') + File.extname(params[:video][:filename])
  File.open(File.join(ENV['APP_VIDEO_FOLDER'], filename), 'wb') do |f|
    while chunk = tmpfile.read(65536)
      f.write(chunk)
    end
  end
end

helpers do
  def random_gradient
    file = File.join(File.dirname(__FILE__), 'resources', 'gradients.json')
    json = JSON.parse(File.read(file))
    json.sample.fetch('colors')
  end
end
