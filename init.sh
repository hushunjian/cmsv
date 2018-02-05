yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_8.x | sudo -E bash -
yum erase -y nodejs npm
rpm -qa 'node|npm' | grep -v nodesource
yum install nodejs -y
