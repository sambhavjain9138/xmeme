cd backend
export NODE_ENV=development
sudo kill -9 `sudo lsof -t -i:8080`
sudo kill -9 `sudo lsof -t -i:8081`
npm start
