                <div class="col-4">
                    <?php if ($colOne): ?>
                    <?php foreach (($colOne?:[]) as $ex1): ?>
                    <div class="card" id="<?= ($ex1['id']) ?>"><div class="card-body flex-grow-1"><p class="card-text"><strong><?= ($ex1['title']) ?>.</strong> <?= ($this->raw(nl2br($ex1['description']))) ?></p></div><div class="card_remove"><button type="button" class="close" aria-label="Close" data-card-remove='<?= ($ex1['id']) ?>'><span aria-hidden="true">&times;</span></button></div></div>
                    <?php endforeach; ?>                
                    <?php endif; ?>
                </div><div class="col-4">
                    <?php if ($colTwo): ?>
                    <?php foreach (($colTwo?:[]) as $ex2): ?>
                    <div class="card" id="<?= ($ex2['id']) ?>"><div class="card-body flex-grow-1"><p class="card-text"><strong><?= ($ex2['title']) ?>.</strong> <?= ($this->raw(nl2br($ex2['description']))) ?></p></div><div class="card_remove"><button type="button" class="close" aria-label="Close" data-card-remove='<?= ($ex2['id']) ?>'><span aria-hidden="true">&times;</span></button></div></div>
                    <?php endforeach; ?>                
                    <?php endif; ?>
                </div><div class="col-4">
                    <?php if ($colThree): ?>
                    <?php foreach (($colThree?:[]) as $ex3): ?>
                    <div class="card" id="<?= ($ex3['id']) ?>"><div class="card-body flex-grow-1"><p class="card-text"><strong><?= ($ex3['title']) ?>.</strong> <?= ($this->raw(nl2br($ex3['description']))) ?></p></div><div class="card_remove"><button type="button" class="close" aria-label="Close" data-card-remove='<?= ($ex3['id']) ?>'><span aria-hidden="true">&times;</span></button></div></div>
                    <?php endforeach; ?>                
                    <?php endif; ?>
                </div>