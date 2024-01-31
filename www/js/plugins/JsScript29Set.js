let N_WinResizeFlg = false;
let Nupu_DbgKomeda_Update = Game_Interpreter.prototype.NUpdate;
Game_Interpreter.prototype.NUpdate = function () {
    Nupu_DbgKomeda_Update.call(this);
    if (!N_WinResizeFlg) {
        window.resizeBy(-500, -400); 
        N_WinResizeFlg = true;
    }
}
