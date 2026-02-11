import dns from 'dns';
dns.resolveSrv('_mongodb._tcp.cluster0.i7pd2cg.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('SRV Resolution failed:', err);
  } else {
    console.log('SRV Records:', addresses);
  }
});
