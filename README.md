# binaize-ui

## To deploy in EC2 DEV cluster

```bash
ssh -i "binaize-optimize.pem" ubuntu@dev.app.binaize.com
sudo apt update
sudo apt -y install docker.io
sudo apt -y install docker-compose
git clone https://github.com/binaize/binaize-ui.git
cd binaize-ui
git checkout development
scp -i "binaize-optimize.pem" ./theia-dev.env ubuntu@dev.app.binaize.com:~/binaize-ui/
cp binaize-ui/theia-dev.env binaize-ui/theia.env
```

## To deploy in EC2 PROD cluster

```bash
ssh -i "binaize-optimize.pem" ubuntu@app.binaize.com
sudo apt update
sudo apt -y install docker.io
sudo apt -y install docker-compose
git clone https://github.com/binaize/binaize-ui.git
cd binaize-ui
git checkout master
scp -i "binaize-optimize.pem" ./theia-dev.env ubuntu@app.binaize.com:~/binaize-ui/
cp binaize-ui/theia-prod.env binaize-ui/theia.env
```

# For first time deployment

```bash
nohup sudo docker-compose -f docker-compose-theia.yaml up --build --remove-orphans >> ~/theia.out&
```

# For re-deployment
```bash
nohup sudo docker-compose -f docker-compose-theia.yaml up --build --remove-orphans theia >> ~/theia.out&
```

