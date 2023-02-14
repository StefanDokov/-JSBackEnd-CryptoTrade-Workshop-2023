const Crypto = require('../models/Crypto');

exports.create = (ownerId, cryptoData) => Crypto.create({...cryptoData,owner: ownerId});

exports.getAll = () => Crypto.find({}).lean();

exports.getOne = (cryptoId) => Crypto.findById(cryptoId);

exports.buy = async(userId, cryptoId) => {
    const crypto = await Crypto.findById(cryptoId);
    crypto.buyers.push(userId);
    await crypto.save();
}

exports.update = (cryptoId, cryptoData) => Crypto.findByIdAndUpdate(cryptoId, cryptoData, {runValidators: true});

exports.delete = (cryptoId) => Crypto.findByIdAndDelete(cryptoId);

exports.search = async(name, payment) => {
    let crypto = await this.getAll();

    if (name) {
        crypto = crypto.filter(x => x.name.toLowerCase() == name.toLowerCase());
    }

    if (payment) {
        crypto =  crypto.filter(x => x.payMethod == payment);
    }

    return crypto;
}