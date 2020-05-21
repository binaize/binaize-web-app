# binaize-ui

## To deploy in EC2

```bash
ssh -i "binaize-optimize.pem" ubuntu@34.201.173.41
sudo apt update
sudo apt -y install docker.io
sudo apt -y install docker-compose
git clone https://github.com/binaize/binaize-ui.git
cd binaize-ui
git checkout development
scp -i "binaize-optimize.pem" ./config.env ubuntu@34.201.173.41:~/binaize-ui/
sudo docker-compose -f docker-compose-theia.yaml build
nohup sudo docker-compose -f docker-compose-theia.yaml up >> ~/theia.out&
```
