const Sauce = require('../models/Sauce');
const fs = require('fs');

/*Creating a sauce*/
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

/*Fetching a sauce from DB*/
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

/*Modifying a sauce*/
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
};

/*Deleting a sauce*/
exports.deleteSauce = (req, res, next) => {
Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
    });
    })
    .catch(error => res.status(500).json({ error }));
};

/*Fetching all sauces from DB*/
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};



/*Likes ans dislikes*/
exports.voteSauce = (req, res, next) => {
  const vote = req.body.like;
  switch(vote){
        /*User llikes*/
        case 1 :
            Sauce.updateOne({_id : req.params.id}, {$inc : {likes : +1 }, /*Adding like*/
            $push : { usersLiked : req.body.userId} /*Adding user id to table*/
          })
              .then(() => res.status(201).json({message : "J'aime ajouté"}))
              .catch(error => res.status(500).json({error}))       
        break;

        /*User dislakes*/
        case -1 :
          Sauce.updateOne({_id : req.params.id}, {$inc : {dislikes : +1 }, /*Adding dislike*/
            $push : { usersDisliked : req.body.userId} /*Adding user id to table*/
          })
              .then(() => res.status(201).json({message : "je n'aime pas ajouté"}))
              .catch(error => res.status(500).json({ error }))
        break;

        /*Suppressing like or dislike*/
        case 0 :  
          Sauce.findOne({_id : req.params.id})
              .then(sauce => {
                  if (sauce.usersLiked.includes(req.body.userId)){
                    Sauce.updateOne({_id : req.params.id}, {$inc : {likes : -1 }, /*Suppress like*/
                      $pull : { usersLiked : req.body.userId} /*Delete user id from table*/
                    })
                      .then(() => res.status(201).json({message : "j'aime a été retiré !"}))
                      .catch(error => res.status(500).json({error}))
                  }
                  else{
                    Sauce.updateOne({_id : req.params.id}, {$inc : {dislikes : -1 }, /*Suppress dislike*/
                      $pull : { usersDisliked : req.body.userId} /*Delete user id from table*/
                    })
                      .then(() => res.status(201).json({message : "je n'aime pas été retiré !"}))
                      .catch(error => res.status(500).json({ error }))
                  }

              }) 
              .catch(error => res.status(500).json({ error}))
        break;  
          
        default : console.log(req.body)
    }
  
}