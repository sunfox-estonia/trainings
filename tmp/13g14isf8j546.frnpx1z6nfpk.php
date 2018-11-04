                <p class="exr_categ">
                <?php if ($categories): ?>
                
                    <?php foreach (($categories?:[]) as $cat): ?>
                        <a href="#" data-category-id="<?= ($cat['id']) ?>" class="<?php if ($req_cat_id==$cat['id']): ?>exr_categ_current<?php endif; ?>" onclick="Link2Category('<?= ($cat['id']) ?>')"><?= ($cat['title']) ?></a>
                    <?php endforeach; ?>                
                
                <?php else: ?>
                    <div class="alert alert-primary" role="alert">Категории упражнений отсутствуют. Добавьте первую категорию при помощи кнопки выше.</div>
                
                <?php endif; ?>
                </p>