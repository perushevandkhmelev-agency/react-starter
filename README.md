# Projectname frontend application

* `git clone git@bitbucket.org:projectname/projectname.git`
* `cd projectname`
* `yarn`
* put `.env` file with contents given below
* `yarn start`

### .env

    UV_THREADPOOL_SIZE=100
    SERVER_PORT=4000
    API_URL=http://api.projectname
    PROXY=true

### How to work with icons

* Make new git branch
* `yarn icons:edit` to open current config with Fontello for editing
* Edit icons in opened browser window and press **"Save session"** when done (don't forget to select newly added icons)
* `yarn icons:save`
* Commit changes and make separate PR
