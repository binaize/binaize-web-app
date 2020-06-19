# Binaize UI

### To Deploy in EC2

```bash
ssh -i "binaize-optimize.pem" ubuntu@app.binaize.com
sudo apt update
sudo apt -y install docker.io
sudo apt -y install docker-compose
git clone https://github.com/binaize/binaize-ui.git
cd binaize-ui
git checkout development
scp -i "binaize-optimize.pem" ./config.env ubuntu@app.binaize.com:~/binaize-ui/
sudo docker-compose -f docker-compose-theia.yaml build
nohup sudo docker-compose -f docker-compose-theia.yaml up --build --remove-orphans >> ~/theia.out&
```
##
### To Deploy to Dev Environment
```bash
ssh -i "binaize-optimize.pem" ubuntu@dev.app.binaize.com
sudo apt update
sudo apt -y install docker.io
sudo apt -y install docker-compose
```

```
git clone https://github.com/binaize/binaize-ui.git
cd binaize-ui
git checkout development
git pull
scp -i "binaize-optimize.pem" ./config.env ubuntu@app.binaize.com:~/binaize-ui/
sudo docker-compose -f docker-compose-theia.yaml down
sudo docker-compose -f docker-compose-theia.yaml build
nohup sudo docker-compose -f docker-compose-theia.yaml up --build --remove-orphans >> ~/theia.out&
```