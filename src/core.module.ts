import {CoverModule} from "./modules/cover/cover.module";
import {FormatModule} from "./modules/format/format.module";
import {forwardRef, Global, Module} from "@nestjs/common";
import {AuthorModule} from "./modules/author/author.module";
import {BookModule} from "./modules/book/book.module";
import {PublishingModule} from "./modules/publishing/publishing.module";
import {GenreModule} from "./modules/genre/genre.module";
import {AvatarModule} from "./modules/avatar/avatar.module";

@Global()
@Module({
    imports: [
        forwardRef(() => AuthorModule),
        forwardRef(() => BookModule),
        forwardRef(() => CoverModule),
        forwardRef(() => FormatModule),
        forwardRef(() => PublishingModule),
        forwardRef(() => GenreModule),
        forwardRef(() => AvatarModule),
    ],
    exports: [
        AuthorModule,
        BookModule,
        CoverModule,
        FormatModule,
        PublishingModule,
        GenreModule,
        AvatarModule,
    ],
})
export class CoreModule {}
