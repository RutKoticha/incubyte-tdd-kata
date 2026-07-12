package com.incubyte_kata.api.users;

import com.incubyte_kata.api.users.dto.RegisterUserRequest;
import com.incubyte_kata.api.users.dto.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @org.mapstruct.Builder(disableBuilder = true)
)
public interface UserMapper {
    UserEntity toEntity(RegisterUserRequest dto);

    UserResponse toResponse(UserEntity entity);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(RegisterUserRequest dto, @MappingTarget UserEntity entity);
}
