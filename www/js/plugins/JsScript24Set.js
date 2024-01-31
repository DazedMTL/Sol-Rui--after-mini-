/* 目次　パーツプラグイン
■スクロールバー
*/
/* 使用方法
    var _sc = new N_Scroll("PicName" , 500 , 15,100,100);
    _sc.ViewCount = 10; 
    _sc.ItemCount = 15; 
    _sc.ZureAdd(1); 
*/
class N_Scroll { 
    constructor(_ImgName, _ImgYSize, _PicNo, _PosX, _PosY) {
        this.ItemCount = 0;     
        this.ViewCount = 0;     
        this.ZureNo = 0;        
        this.BarMinSize = 0.1;  
        this.BarMinPar = 0.1;  
        this.ImgName = _ImgName;    
        this.ImgYSize = _ImgYSize;  
        this.PicNo = _PicNo;        
        this.posX = _PosX;          
        this.posY = _PosY;          
    }
    ZureAdd(_Var) { 
        this.ZureNo += _Var;
        var _SkCnt = this.ItemCount - this.ViewCount; 
        if (_SkCnt < 0) _SkCnt = 0;
        if (0 > this.ZureNo) this.ZureNo = 0;
        if (_SkCnt < this.ZureNo) this.ZureNo = _SkCnt;
    }
}
Game_Interpreter.prototype.ScrollView = function (_NScroll, _SetOpi) {
    var _SetOpi = typeof _SetOpi !== 'undefined' ? _SetOpi : 255;
    var _SkCnt = _NScroll.ItemCount - _NScroll.ViewCount; 
    if (_SkCnt <= 0) { 
        this.SetPict(_NScroll.PicNo, _NScroll.ImgName, _NScroll.posX, _NScroll.posY, _SetOpi);
        return;
    }
    var _BarMy = 1 - (_SkCnt * _NScroll.BarMinPar);
    if (_BarMy <= _NScroll.BarMinSize) _BarMy = _NScroll.BarMinSize;
    var _SkmY = _NScroll.ImgYSize * (1 - _BarMy); 
    var _SkmPxcel = _SkmY / _SkCnt; 
    if (0 > _NScroll.ZureNo) _NScroll.ZureNo = 0;
    if (_SkCnt < _NScroll.ZureNo) _NScroll.ZureNo = _SkCnt;
    var _ZureY = _SkmPxcel * _NScroll.ZureNo; 
    this.SetPict(_NScroll.PicNo, _NScroll.ImgName, _NScroll.posX, _NScroll.posY + _ZureY,
        _SetOpi, 100, _BarMy * 100);
}
