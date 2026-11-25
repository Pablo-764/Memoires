import{$t as np,Ft as eE,H as H$1,I as D,J as Kv,Jt as lp,K as Jv,N as Ao,P as B,St as ae,X as Mv,Yt as mc,_t as Yv,fn as tE,ft as Wy,gn as wp,mn as uE,pn as tk,rn as pc,sn as rI,tt as PE,ut as Wd,yt as _E,zt as fc}from"./main-4LPKTBLG.js";var n=a=>{let e=String.raw(a).replace(/^\n|\n\s*$/g,``).split(`
`),t=Math.min(...e.filter(_=>_.trim()).map(_=>_.match(/^ */)[0].length));return e.map(_=>_.slice(t).replace(/\s+$/,``))};var A={flor:{label:`una rosa abierta`,intent:`romance`,frames:[n`
                   {.-'''''''-.}
               {.-'  .-''''-.  '-.}
             {.'   .'  .--.  '.   '.}
            {/    /  .'    '.  \    \}
           {|    |  (   @@   )  |    |}
           {|    |   '.    .'   |    |}
            {\    \    '--'    /    /}
             {'.   '-.______.-'   .'}
         {.-''-.'-.            .-'.-''-.}
        {(      '-.'-..____..-'.-'      )}
          {'-.       ''''''''       .-'}
            {'-..___          ___..-'}
                 {''''-.  .-''''}
                       ||
           .-«~~~»-.     ||     .-«~~~»-.
         .'  «~~~  »'.   ||   .'  «~~~  »'.
        (  «~~~~~~~  »'-.||.-'  «~~~~~~~  »)
         '.  «~~~   ».'  ||  '.   «~~~  ».'
           '-...-'    >||<    '-...-'
                       ||
                       ||
         «~~~~~~~~~~~~~~»||«~~~~~~~~~~~~~~»
        «~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~»
      `]},"flor-marchita":{label:`una rosa que se endereza`,intent:`romance`,frames:[n`




                        {.-----------.}
                      {.'             '.}
                     /                 {\}
                    |               {.-'''''-.}
                    |             {.'  .--.   '.}
                    |            {(   (  @@ )   )}
                    |             {'.  '--'   .'}
                    |               {'-.___.-'}
                    |                  {'.'}
                    |
           .-«~~~»-.  |
         .'  «~~~  »'.|
        (  «~~~~~~~  »'|
         '.  «~~~   ».'|
           '-...-'   |
                     |
                     |
         «~~~~~~~~~~~~»|«~~~~~~~~~~~~~~~~~~»
        «~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~»
      `,n`
                   {.-'''''''-.}
               {.-'  .-''''-.  '-.}
             {.'   .'  .--.  '.   '.}
            {/    /  .'    '.  \    \}
           {|    |  (   @@   )  |    |}
           {|    |   '.    .'   |    |}
            {\    \    '--'    /    /}
             {'.   '-.______.-'   .'}
         {.-''-.'-.            .-'.-''-.}
        {(      '-.'-..____..-'.-'      )}
          {'-.       ''''''''       .-'}
            {'-..___          ___..-'}
                 {''''-.  .-''''}
                       ||
           .-«~~~»-.     ||     .-«~~~»-.
         .'  «~~~  »'.   ||   .'  «~~~  »'.
        (  «~~~~~~~  »'-.||.-'  «~~~~~~~  »)
         '.  «~~~   ».'  ||  '.   «~~~  ».'
           '-...-'    >||<    '-...-'
                       ||
                       ||
         «~~~~~~~~~~~~~~»||«~~~~~~~~~~~~~~»
        «~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~»
      `]},taza:{label:`una taza de café con vapor`,intent:`friend`,frames:[n`
                   {(     )    (}
                    {)   (    )  )}
                   {(     )  (   (}
                    {)  (     )    )}
             .-'''''''''''''''''''-.
            (                       )
            |'-.._______________..-'|-----.
            |  «.-.  .-.  .-.  .-.   »|     |
            |  «'-'  '-'  '-'  '-'   »| .-. |
            |                       | | | |
            |                       | '-' |
            |                       |-----'
             \                     /
              '.                 .'
         .-------'-..._____...-'-------.
        (_______________________________)
      `,n`
                    {)    (     )}
                   {(   )    (    (}
                    {)    (  )    )}
                   {(   (     )   (}
             .-'''''''''''''''''''-.
            (                       )
            |'-.._______________..-'|-----.
            |  «.-.  .-.  .-.  .-.   »|     |
            |  «'-'  '-'  '-'  '-'   »| .-. |
            |                       | | | |
            |                       | '-' |
            |                       |-----'
             \                     /
              '.                 .'
         .-------'-..._____...-'-------.
        (_______________________________)
      `,n`
                   {(    (     )}
                    {)     )  (   )}
                   {(    (    )   (}
                    {)    )  (     )}
             .-'''''''''''''''''''-.
            (                       )
            |'-.._______________..-'|-----.
            |  «.-.  .-.  .-.  .-.   »|     |
            |  «'-'  '-'  '-'  '-'   »| .-. |
            |                       | | | |
            |                       | '-' |
            |                       |-----'
             \                     /
              '.                 .'
         .-------'-..._____...-'-------.
        (_______________________________)
      `]},"dos-tazas":{label:`dos tazas de café esperando`,intent:`friend`,frames:[n`
               {(   )                          (   )}
                {)   (                        )   (}
               {(   )                          (   )}
            .-'''''''''-.                .-'''''''''-.
           (             )              (             )
           |'-.._____..-'|---.      .---|'-.._____..-'|
           |  «.-.   .-.  »|   |      |   |  «.-.   .-.  »|
           |  «'-'   '-'  »| .-'      '-. |  «'-'   '-'  »|
           |             |-'          '-|             |
            \           /                \           /
              '-.._..-'                    '-.._..-'
         ____________________________________________________
        (____________________________________________________)
      `]},cerezas:{label:`unas cerezas con su hoja`,intent:`romance`,frames:[n`
                           __
                         .'  '.
                     _.-'  «~~  »)
                   .' «~~~~  ».-'|
                   '-....-''   |
                         /     \
                        /       \
                       /         \
                      /           \
                     /             \
               {.--../               \..--.}
             {.' .-.  '.           .' .-.  '.}
            {/  (   )   \         /  (   )   \}
           {|    '-'     |       |    '-'     |}
           {|            |       |            |}
            {\          /         \          /}
             {'.      .'           '.      .'}
               {'----'               '----'}
      `]},"ramo-arleth":{label:`un ramo de rosas para Arleth`,intent:`romance`,frames:[n`
           {.-'''-.     .-'''-.     .-'''-.}
          {( (@@@) )   ( (@@@) )   ( (@@@) )}
           {'-...-'     '-...-'     '-...-'}
           {.-'''-.  }\  {.-'''-.  }/  {.-'''-.}
          {( (@@@) )  }\{( (@@@) )}/  {( (@@@) )}
           {'-...-'    }\{'-...-'}/    {'-...-'}
                \  «~~  »\  |  /  «~~  »/
                 \ «~~~  »\ | /  «~~~ »/
                  '. «~   »\|/   «~ ».'
                    '-.  \|/  .-'
                    '-.___|___.-'
              .-----------'-----------.
             (     «~   »{Arleth   }«~     »)
              '-----------.-----------'
                     /  \ | /  \
                    /    \|/    \
                   /      |      \
                  / «·  ·  »|  «·  · »\
                 /________|________\
      `]},corazon:{label:`un corazón con el nombre de Arleth`,intent:`romance`,frames:[n`
            .-'''''-.     .-'''''-.
          .'         '. .'         '.
         /             V             \
         |                           |
         |           {Arleth          }|
         |                           |
         \      «~ »{eres bonita }«~      »/
          '.                       .'
            '.                   .'
              '.               .'
                '.           .'
                  '.       .'
                    '.   .'
                      'V'
      `]},tetera:{label:`una tetera humeante`,intent:`friend`,frames:[n`
                          {_}
                        {_(_)_}
                     .-'     '-.
              .--.  /           \        __
             /  .-'|  «~~~ ~~~~   »|      / /
            |  /   |             |_____/ /
            |  \   |  «~~~~ ~~~   »|------'
             \  '-.|             |
              '--' \  «~~ ~~~~~  »/
                    '-._______.-'
                 .-'''''''''''''-.
                 '-.___________.-'
      `]},pan:{label:`un pan dulce`,intent:`friend`,frames:[n`
                _.-''''''''''''-._
             {.-'  .  '  .  '  .  '-.}
           {.'  '  .  '  .  '  .  '  '.}
          {/  .  '  .  '  .  '  .  '  . \}
         {|  '  .  '  .  '  .  '  .  '  |}
         |«~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~»|
         '-.__________________________.-'
      `]},globo:{label:`un globo aerostático`,intent:`plan`,frames:[n`
             {.-''''''''''-.}
           {.'  |   |   |   '.}
          {/   |    |    |    \}
          {|   |     |     |   |}
          {|   |     |     |   |}
           {\   \    |    /   /}
            {'.  \   |   /  .'}
              '. \  |  / .'
                '.\ | /.'
                  \ | /
                   \|/
                 [_____]
                 |_____|
      `]},boletos:{label:`dos boletos para un plan con Arleth`,intent:`plan`,frames:[n`
         .------------------.-------.
         |  ¿{vamos}?         :  {N}.   |
         )   {para dos       }:  02   (
         |  «· · · · · · ·   »:       |
         '------------------'-------'
              .------------------.-------.
              |  {primera fila    }:  {N}.   |
              )   {Arleth y tú    }:  03   (
              |  «· · · · · · ·   »:       |
              '------------------'-------'
      `]},tienda:{label:`una tienda de campaña bajo las estrellas`,intent:`plan`,frames:[n`
            {*        .        *}
              {.             *}
                     /\
                    /  \
                   /    \
                  /  /\  \
                 /  /  \  \
                /  /    \  \
               /  /      \  \
              /  /   ..   \  \
             /__/___/  \___\__\
         «~~~~~~~~~~~~~~~~~~~~~~~~~~»
      `]},guitarra:{label:`una guitarra`,intent:`hobby`,frames:[n`
               _
             «=»|_|«=»
             «=»|_|«=»
              | |
              | |
              | |
              | |
            {.-| |-.}
           {/  | |  \}
          {|  .| |.  |}
          {\ (  O  ) /}
          {/  '---'  \}
         {|    ===    |}
         {|           |}
          {\         /}
           {'-.___.-'}
      `]},paleta:{label:`una paleta de pintor`,intent:`hobby`,frames:[n`
                 _.-''''''''''-._
              .-'  ({o})    ({o})    '-.
            .'  ({o})            .--.  '.
           /          ({o})     (    )   \
          |   ({o})              '--'     |
           \          .-.              /
            '.       (   )          _.'
              '-.     '-'      _.--''
                 ''--..___..--''
      `]},taco:{label:`un taco`,intent:`plan`,frames:[n`
                      _.--''''''''''''''--._
                  {_.-'  o    *    o    *    '-._}
               .-'  {~~~~~~~~~~~~~~~~~~~~~~~~~~  '}-.
             .'  .  {*  .  o  .  *  .  o  .  *  .   }'.
            /  ~~~{~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~}~~  \
           «/   .     .     .     .     .     .        \»
          /____________________________________________\
      `]},mantel:{label:`un plato vacío sobre un mantel`,intent:`plan`,frames:[n`
                         _.--''''''''--._
            |||       .{-'   _.------._   '-}.        /|
            |||     .'   {.-'          '-.   }'.     | |
            |||    /    {/                \    }\    | |
            \_/   |    {|                  |    }|   | |
             |    |    {|                  |    }|   | |
             |    |    {|                  |    }|   |/
             |     \    {\                /    }/    |
             |      '.   {'-._        _.-'   }.'     |
             |        '{-.    ''----''    .-}'       |
             |           ''--..____..--''          |
         «/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\»
         «\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/»
      `]},libro:{label:`un libro abierto`,intent:`hobby`,frames:[n`
          ______________________ ______________________
         /                      |                      \
        |   «~~~~~~~~~~~~~~~~    »|   «~~~~~~~~~~~~~       »|
        |   «~~~~~~~~~~~~        »|   «~~~~~~~~~~~~~~~~~   »|
        |   «~~~~~~~~~~~~~~~     »|   «~~~~~~~~~           »|
        |   «~~~~~~~~~           »|   «~~~~~~~~~~~~~~      »|
        |   «~~~~~~~~~~~~~~      »|   «~~~~~~~~~~~~        »|
        |   «~~~~~~~~~~~         »|   «~~~~~~~~~~~~~~~~    »|
        |_______________________{|}_______________________|
         '-.____________________{V}____________________.-'
      `]},dado:{label:`un dado`,intent:`hobby`,frames:[n`
               ____________________
              /\                   \
             /  \     ({o})           \
            /({o}) \                   \
           /      \     ({o})           \
          / ({o})    \                   \
         /          \___________________\
         \          /                   /
          \ ({o})    /    ({o})       ({o})  /
           \      /                   /
            \    /     ({o})      ({o})  /
             \  /                   /
              \/___________________/
      `]},nota:{label:`dos notas musicales`,intent:`hobby`,frames:[n`
                      ______________________
                     |{______________________}|
                     |{______________________}|
                     |                      |
                     |                      |
                     |                      |
                 .--.|                  .--.|
                (    |                 (    |
                 '--'                   '--'
          «-------------------------------------»
          «-------------------------------------»
          «-------------------------------------»
      `]},tenis:{label:`un tenis para correr`,intent:`plan`,frames:[n`
                            ___________
                       _.--'  {|X|X|X|  }'--._
                    .-'       {|X|X|X|       }'-.
                 «.-'     o    o    o    o      '.»
            __.-'                                '.
          .'                                       '-------._
         (___________________________________________________)
          «'-..-..-..-..-..-..-..-..-..-..-..-..-..-..-..-..-'»
      `]},maceta:{label:`una maceta con plantas y una flor`,intent:`hobby`,frames:[n`
                         {.-.}
                      {.-(   )-.}
                     {(  '-.-'  )}
                      {'-.._..-'}
                 .-.      |      .-.
               .'   '.    |    .'   '.
              ( «~~~~  »'.  |  .'  «~~~~ »)
               '.  «~~~  »'.|.'  «~~~  ».'
                 '-...-'  |  '-...-'
            .-«~~»-.        |        .-«~~»-.
          .' «~~~  »'.      |      .'  «~~~ »'.
         ( «~~~~~~   »'-.   |   .-'   «~~~~~~ »)
          '.  «~~~    ».'   |   '.    «~~~  ».'
            '-.....-'     |     '-.....-'
          .-------------------------------.
          |_______________________________|
           «\ .:.   .:.   .:.   .:.   .:. /»
            «\  ':'  ':'  ':'  ':'  ':'  /»
             \                         /
              \_______________________/
      `]},lupa:{label:`una lupa`,intent:`hobby`,frames:[n`
                _.--''''''''--._
             .-'   _.------._   '-.
           .'   .-'          '-.   '.
          /    /                \    \
         |    |      {.--.        }|    |
         |    |      {'  .'       }|    |
         |    |        {|         }|    |
          \    \       {o        }/    /
           '.   '-._        _.-'   .'
             '-.    ''----''    .-'\ \
                ''--..____..--''    \ \
                                     \ \
                                      \ \
                                       \_\
      `]}};var F=[[/corr|carrera|trote|km\b/i,`tenis`],[/juego|catan|mesa|dado|rol\b/i,`dado`],[/concierto|música|musica|banda|karaoke|guitarra/i,`nota`],[/libro|lectura|leer|club de lectura|biblioteca/i,`libro`],[/café|cafe|desayuno|pan\b/i,`taza`],[/taco|comida|comer|cena|pizza|mercado/i,`taco`],[/arleth|flor/i,`ramo-arleth`],[/jard|planta|vivero/i,`maceta`]];function $(a,e){return F.find(([t])=>t.test(a))?.[1]??H[e]}var q={any:[`cerezas`,`flor`,`ramo-arleth`,`maceta`],romance:[`cerezas`,`flor`,`ramo-arleth`,`corazon`],friend:[`tetera`,`taza`,`pan`,`maceta`],plan:[`globo`,`boletos`,`tienda`,`lupa`],hobby:[`guitarra`,`paleta`,`dado`,`nota`]};var H={romance:`flor`,friend:`taza`,plan:`taco`,hobby:`dado`};function T(a){let e=[],t=/\{([^}]*)\}|«([^»]*)»/g,_=0;for(let i=t.exec(a);i;i=t.exec(a))i.index>_&&e.push({t:a.slice(_,i.index),k:``}),e.push(i[1]!==void 0?{t:i[1],k:`a`}:{t:i[2],k:`d`}),_=t.lastIndex;return _<a.length&&e.push({t:a.slice(_),k:``}),e}function X(a,e){if(a&1&&(fc(0,`span`),PE(1),pc()),a&2){let t=e.$implicit;_E(t.k),Wy(),wp(t.t)}}function L(a,e){if(a&1&&(fc(0,`span`,1),eE(1,X,2,3,`span`,3,Jv),pc()),a&2){let t=e.$implicit;Wy(),tE(t)}}function V(a,e){if(a&1&&(fc(0,`span`,2),PE(1),pc()),a&2){let t=uE();Wy(),mc(`Ilustración: `,t.info().label)}}var z=`.:+*`;var j=class a{piece=tk.required();intent=tk(null);size=tk(`md`);mode=tk(`static`);decorative=tk(!1);info=rI(()=>A[this.piece()]??A.maceta);frame=Ao(null);still=typeof matchMedia<`u`&&matchMedia(`(prefers-reduced-motion: reduce)`).matches;decoded=Ao(null);lines=rI(()=>{let e=this.info().frames,t=this.frame()??(this.still&&this.mode()!==`static`&&this.mode()!==`decode`?e.length-1:0),_=e[Math.min(t,e.length-1)].map(T),i=this.decoded();if(i===null)return _;let d=0;return _.map(m=>m.map(r=>H$1(B({},r),{t:[...r.t].map(p=>{if(p===` `)return p;let f=i-d++;return f>=z.length?p:f>=0?z[f]:` `}).join(``)})))});constructor(){let e=0;Wd(()=>{let t=this.info().frames.length,_=this.mode();if(_===`decode`&&!this.still){let d=this.info().frames[0].join(``).replace(/[\s{}«»]/g,``).length,m=Math.max(1,Math.ceil(d/45)),r=0;this.decoded.set(0),e=window.setInterval(()=>{if(r+=m,r>=d+z.length){this.decoded.set(null),window.clearInterval(e);return}this.decoded.set(r)},28);return}if(this.still||t<2||_!==`loop`&&_!==`grow`)return;let i=0;e=window.setInterval(()=>{if(i++,_===`grow`&&i>=t-1){this.frame.set(t-1),window.clearInterval(e);return}this.frame.set(i%t)},_===`grow`?520:700)}),D(ae).onDestroy(()=>window.clearInterval(e))}hover(e){this.mode()!==`hover`||this.still||this.frame.set(e?this.info().frames.length-1:0)}static ɵfac=function(t){return new(t||a)};static ɵcmp=Mv({type:a,selectors:[[`app-ascii`]],hostAttrs:[1,`ascii`],hostVars:3,hostBindings:function(t,_){t&1&&lp(`pointerenter`,function(){return _.hover(!0)})(`pointerleave`,function(){return _.hover(!1)}),t&2&&np(`data-size`,_.size())(`data-intent`,_.intent()??_.info().intent)(`aria-hidden`,_.decorative()||null)},inputs:{piece:[1,`piece`],intent:[1,`intent`],size:[1,`size`],mode:[1,`mode`],decorative:[1,`decorative`]},decls:4,vars:1,consts:[[`aria-hidden`,`true`,1,`ascii-pre`],[1,`ascii-line`],[1,`sr-only`],[3,`class`]],template:function(t,_){t&1&&(fc(0,`pre`,0),eE(1,L,3,0,`span`,1,Jv),pc(),Yv(3,V,2,1,`span`,2)),t&2&&(Wy(),tE(_.lines()),Wy(2),Kv(_.decorative()?-1:3))},styles:[`[_nghost-%COMP%]{display:inline-block;color:var(--%NS%ascii-ink, var(--%NS%color-accent))}.ascii-pre[_ngcontent-%COMP%]{margin:0;font-family:var(--%NS%font-mono);font-size:clamp(9px,1vw,11px);font-weight:700;line-height:1;letter-spacing:0;white-space:pre}[data-size="sm"][_nghost-%COMP%]   .ascii-pre[_ngcontent-%COMP%]{font-size:clamp(7px,.75vw,9px)}[data-size="lg"][_nghost-%COMP%]   .ascii-pre[_ngcontent-%COMP%]{font-size:clamp(9px,1.2vw,13px)}.ascii-line[_ngcontent-%COMP%]{display:block;min-height:1em}.a[_ngcontent-%COMP%]{color:var(--%NS%ascii-accent, var(--%NS%intent-c))}.d[_ngcontent-%COMP%]{color:var(--%NS%ascii-detail)}`]})};export{j as n,q as r,$ as t};